// backend/routes/admin.js
const express = require("express");
const router = express.Router();
const { authenticate, requireRole, middlewareUploadGambar, sendHasilUpload } = require("../middlewares");
const usersController = require("../controllers/usersController");
const adminController = require("../controllers/adminController");

// Semua route admin wajib authenticate + role admin
router.use(authenticate);
router.use(requireRole("admin"));

// Profile admin
router.get("/me", usersController.getMyProfile);
router.put("/me", middlewareUploadGambar, usersController.updateMyProfile);

// Statistik
router.get("/stats", adminController.getStats);

// CRUD Produk
router.get("/produk", adminController.listProduk);
router.get("/produk/:id", adminController.getProdukById);
router.post("/produk", middlewareUploadGambar, adminController.createProduk);
router.put("/produk/:id", middlewareUploadGambar, adminController.updateProduk);
router.delete("/produk/:id", adminController.deleteProduk);

// Kelola Pembelian
router.get("/pembelian", adminController.listPembelian);
router.get("/pembelian/:id", adminController.getPembelianById);
router.put("/pembelian/:id", adminController.updatePembelian);
router.delete("/pembelian/:id", adminController.deletePembelian);

// CRUD Pembeli
router.get("/pembeli", adminController.listPembeli);
router.get("/pembeli/:id", adminController.getPembeliById);
router.post("/pembeli", middlewareUploadGambar, adminController.createPembeli);
router.put("/pembeli/:id", middlewareUploadGambar, adminController.updatePembeli);
router.delete("/pembeli/:id", adminController.deletePembeli);

// CRUD Artikel
router.get("/artikel", adminController.listArtikel);
router.get("/artikel/:id", adminController.getArtikelById);
router.post("/artikel", middlewareUploadGambar, adminController.createArtikel);
router.put("/artikel/:id", middlewareUploadGambar, adminController.updateArtikel);
router.delete("/artikel/:id", adminController.deleteArtikel);

// Upload gambar
router.post("/upload-gambar", middlewareUploadGambar, sendHasilUpload);

module.exports = router;