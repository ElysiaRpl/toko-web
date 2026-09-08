// backend/middlewares/index.js
const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ==================== AUTH MIDDLEWARE ====================

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await usersModel.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      uname: user.uname,
      nama_d: user.nama_d,
      nama_b: user.nama_b
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token tidak valid" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token sudah kadaluarsa" });
    }
    console.error("Auth error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Belum terautentikasi" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Akses ditolak! Role tidak sesuai" });
    }

    next();
  };
};

// ==================== UPLOAD MIDDLEWARE ====================

// Buat folder uploads/images jika belum ada
const uploadDir = path.join(__dirname, "../uploads/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Format: timestamp-nama-asli
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Filter file: hanya gambar
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  if (allowedTypes.test(ext) && allowedTypes.test(mimeType)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diizinkan (jpeg, jpg, png, gif, webp)"));
  }
};

// Middleware upload gambar (field "gambar", max 5MB)
const uploadGambar = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
}).any();

// Middleware wrapper untuk handle error multer
const middlewareUploadGambar = (req, res, next) => {
  uploadGambar(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Ukuran file maksimal 5MB" });
      }
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// Helper untuk response upload sukses
const sendHasilUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Tidak ada file yang diupload" });
  }

  const filePath = `/uploads/images/${req.file.filename}`;
  res.status(200).json({
    message: "Upload gambar berhasil",
    data: {
      filename: req.file.filename,
      path: filePath,
      size: req.file.size
    }
  });
};

module.exports = {
  authenticate,
  requireRole,
  middlewareUploadGambar,
  sendHasilUpload
};