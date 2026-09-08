// backend/controllers/usersController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const produkModel = require("../models/produkModel");
const artikelModel = require("../models/artikelModel");
const pembelianModel = require("../models/pembelianModel");

const registerUser = async (req, res) => {
  try {
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, passwd } = req.body;

    // Validasi wajib
    if (!nama_d || !nama_b || !kelamin || !lahir || !alamat || !phone || !email || !uname || !passwd) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    // Cek email sudah terdaftar
    const existingEmail = await usersModel.findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    // Cek username sudah terdaftar
    const existingUname = await usersModel.findUserByCredential(uname);
    if (existingUname) {
      return res.status(409).json({ message: "Username sudah terdaftar" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPasswd = await bcrypt.hash(passwd, saltRounds);

    // Format tanggal
    let lahirFormatted = null;
    if (lahir && lahir.trim() !== '') {
      try {
        const date = new Date(lahir);
        if (!isNaN(date.getTime())) {
          lahirFormatted = date.toISOString().split('T')[0];
        }
      } catch (e) {
      }
    }

    // ✅ Ambil foto dari upload
    let foto = "default.jpg";
    if (req.file) {
      foto = req.file.filename;
    } else if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'foto' || f.fieldname === 'gambar');
      if (file) {
        foto = file.filename;
      }
    } 

    // Simpan user
    const result = await usersModel.createUser({
      nama_d,
      nama_b,
      kelamin,
      lahir: lahirFormatted,
      alamat,
      phone,
      email,
      uname,
      passwd: hashedPasswd,
      foto
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      data: { id: result.insertId, email, uname }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { credential, passwd } = req.body;

    // Validasi
    if (!credential || !passwd) {
      return res.status(400).json({ message: "Email/Username dan password wajib diisi" });
    }

    // Cari user berdasarkan email atau username
    const user = await usersModel.findUserByCredential(credential);
    if (!user) {
      return res.status(401).json({ message: "Email/Username atau password salah" });
    }

    // Verifikasi password
    const isMatch = await bcrypt.compare(passwd, user.passwd);
    if (!isMatch) {
      return res.status(401).json({ message: "Email/Username atau password salah" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Response tanpa password
    const { passwd: _, ...userWithoutPasswd } = user;

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: userWithoutPasswd
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get profile sendiri (dari token)
const getMyProfile = async (req, res) => {
  try {
    const user = await usersModel.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({
      message: "Berhasil mengambil data profil",
      data: user
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Update profile sendiri
const updateMyProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { 
      nama_d, 
      nama_b, 
      kelamin, 
      lahir, 
      alamat, 
      phone, 
      email, 
      passwd_lama, 
      passwd_baru 
    } = req.body || {};

    // Validasi
    if (!nama_d || !nama_b || !email) {
      return res.status(400).json({ 
        message: "Nama depan, nama belakang, dan email wajib diisi" 
      });
    }

    // Cek user ada
    const user = await usersModel.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    console.log("👤 User ditemukan:", user.id, user.nama_d, user.nama_b);

    // Handle foto
    let foto = user.foto || 'default.jpg';
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.fieldname === 'foto' || file.fieldname === 'gambar') {
          foto = file.filename;
          break;
        }
      }
    }

    // Format tanggal
    let lahirFormatted = null;
    if (lahir && lahir.trim()) {
      try {
        const date = new Date(lahir);
        if (!isNaN(date.getTime())) {
          lahirFormatted = date.toISOString().split('T')[0];
        }
      } catch (e) {
      }
    }

    await usersModel.updateUserProfile(id, {
      nama_d: nama_d,
      nama_b: nama_b,
      kelamin: kelamin || user.kelamin || 'Laki-laki',
      lahir: lahirFormatted,
      alamat: alamat || user.alamat || '',
      phone: phone || user.phone || '',
      email: email || user.email,
      foto: foto
    });

    // Handle password
    if (passwd_baru && passwd_baru.trim()) {
      const bcrypt = require("bcrypt");
      
      if (!passwd_lama || !passwd_lama.trim()) {
        return res.status(400).json({ message: "Password lama wajib diisi" });
      }

      const passwdHash = await usersModel.findPasswdHashById(id);
      const isMatch = await bcrypt.compare(passwd_lama, passwdHash);
      
      if (!isMatch) {
        return res.status(401).json({ message: "Password lama salah" });
      }

      const hashedPasswd = await bcrypt.hash(passwd_baru, 10);
      const db = require("../config/db");
      await db.query(`UPDATE users SET passwd = ? WHERE id = ?`, [hashedPasswd, id]);
    }

    const updatedUser = await usersModel.findUserById(id);

    res.status(200).json({
      message: "Profil berhasil diupdate",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Terjadi kesalahan server",
      error: error.message,
      stack: error.stack
    });
  }
};

// ==================== PRODUK PUBLIK ====================

// List semua produk (publik)
const listProduk = async (req, res) => {
  try {
    const produk = await produkModel.findAllProduk();
    res.status(200).json({
      message: "Berhasil mengambil data produk",
      data: produk
    });
  } catch (error) {
    console.error("List produk error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get produk by ID (publik)
const getProdukById = async (req, res) => {
  try {
    const { id_produk } = req.params;
    const produk = await produkModel.findProdukById(id_produk);
    
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    
    res.status(200).json({
      message: "Berhasil mengambil data produk",
      data: produk
    });
  } catch (error) {
    console.error("Get produk error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ==================== ARTIKEL PUBLIK ====================

// List semua artikel (publik)
const listArtikelPublik = async (req, res) => {
  try {
    const artikel = await artikelModel.findAllArtikel();
    res.status(200).json({
      message: "Berhasil mengambil data artikel",
      data: artikel
    });
  } catch (error) {
    console.error("List artikel error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get artikel by ID (publik)
const getArtikelPublikById = async (req, res) => {
  try {
    const { id } = req.params;
    const artikel = await artikelModel.findArtikelById(id);
    
    if (!artikel) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }
    
    res.status(200).json({
      message: "Berhasil mengambil data artikel",
      data: artikel
    });
  } catch (error) {
    console.error("Get artikel error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ==================== DASHBOARD PEMBELI ====================
const getDashboard = async (req, res) => {
  try {
    const id_pembeli = req.user.id;
    
    const stats = await pembelianModel.getStatsByPembeliId(id_pembeli);
    
    // ✅ Hitung pesanan aktif dari data real
    const pesananAktif = (stats?.tertunda || 0) + 
                         (stats?.dikemas || 0) + 
                         (stats?.dikirim || 0);

    // ✅ Kirim data yang benar (JANGAN pakai dummy 100!)
    const statsWithActive = {
      total_pembelian: stats?.total_pembelian || 0,
      selesai: stats?.selesai || 0,
      diterima: stats?.diterima || 0,
      dikirim: stats?.dikirim || 0,
      dikemas: stats?.dikemas || 0,
      tertunda: stats?.tertunda || 0,
      pesanan_aktif: pesananAktif, // ← 1, BUKAN 100!
      dibayar: stats?.dibayar || 0,
      belum_bayar: stats?.belum_bayar || 0,
    };

    const recent = await pembelianModel.findPembelianByPembeliIdWithDetail(id_pembeli);
    
    res.status(200).json({
      message: "Berhasil mengambil data dashboard",
      data: {
        stats: statsWithActive,
        recent_pembelian: recent.slice(0, 5)
      }
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ==================== CRUD PEMBELIAN (PEMBELI) ====================

// Create pembelian baru
const createPembelian = async (req, res) => {
  try {
    const id_pembeli = req.user.id;
    const { id_produk, metode_pembayaran, catatan } = req.body;

    // Validasi wajib
    if (!id_produk || !metode_pembayaran) {
      return res.status(400).json({ message: "id_produk dan metode_pembayaran wajib diisi" });
    }

    // Validasi metode pembayaran
    const validMetode = ["Bank Transfer", "COD"];
    if (!validMetode.includes(metode_pembayaran)) {
      return res.status(400).json({ 
        message: `Metode pembayaran tidak valid. Pilih salah satu: ${validMetode.join(", ")}` 
      });
    }

    // Cek produk ada
    const produk = await produkModel.findProdukById(id_produk);
    if (!produk) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    // Ambil data user
    const user = await usersModel.findUserById(id_pembeli);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    // Data pembelian
    const pembelianData = {
      id_pembeli,
      id_produk,
      nama_pembeli: user.nama_d + " " + user.nama_b,
      alamat_pembeli: user.alamat,
      phone_pembeli: user.phone,
      metode_pembayaran,
      catatan: catatan || null,
      foto_bukti: null
    };

    const result = await pembelianModel.insertPembelian(pembelianData);

    res.status(201).json({
      message: "Pembelian berhasil dibuat",
      data: { id: result.insertId, id_produk, metode_pembayaran }
    });
  } catch (error) {
    console.error("Create pembelian error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// List pembelian milik sendiri
const listMyPembelian = async (req, res) => {
  try {
    const id_pembeli = req.user.id;
    const pembelian = await pembelianModel.findPembelianByPembeliIdWithDetail(id_pembeli);
    
    res.status(200).json({
      message: "Berhasil mengambil data pembelian",
      data: pembelian
    });
  } catch (error) {
    console.error("List my pembelian error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get pembelian milik sendiri by ID
const getMyPembelianById = async (req, res) => {
  try {
    const id_pembeli = req.user.id;
    const { id } = req.params;
    
    const pembelian = await pembelianModel.findPembelianByIdAndPembeliId(id, id_pembeli);
    
    if (!pembelian) {
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });
    }
    
    res.status(200).json({
      message: "Berhasil mengambil data pembelian",
      data: pembelian
    });
  } catch (error) {
    console.error("Get my pembelian error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  listProduk,
  getProdukById,
  listArtikelPublik,
  getArtikelPublikById,
  getDashboard,
  createPembelian,
  listMyPembelian,
  getMyPembelianById
};