// backend/controllers/adminController.js
const produkModel = require("../models/produkModel");
const usersModel = require("../models/usersModel");
const artikelModel = require("../models/artikelModel");
const pembelianModel = require("../models/pembelianModel");

// Validasi kategori
const validCategories = ["Baju Rajut", "Tas Rajut", "Mainan Rajut", "Aksesoris Rajut"];

// ==================== CRUD PRODUK ====================

// List semua produk
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

// Get produk by ID
const getProdukById = async (req, res) => {
  try {
    const { id } = req.params;
    const produk = await produkModel.findProdukById(id);
    
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

// Create produk baru
const createProduk = async (req, res) => {
  try {
    const { nama_produk, deskripsi, harga, kategori } = req.body;

    let gambar = null;
    if (req.file) {
      gambar = req.file.filename;
    } else if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'gambar');
      if (file) {
        gambar = file.filename;
      }
    }

    // Validasi wajib
    if (!nama_produk || !deskripsi || !harga || !kategori) {
      return res.status(400).json({ message: "Semua field wajib diisi (nama_produk, deskripsi, harga, kategori)" });
    }

    if (!gambar) {
      return res.status(400).json({ 
        message: "Gambar produk wajib diupload" 
      });
    }

    // Validasi kategori
    if (!validCategories.includes(kategori)) {
      return res.status(400).json({ 
        message: `Kategori tidak valid. Pilih salah satu: ${validCategories.join(", ")}` 
      });
    }

   let hargaNum;
    if (typeof harga === "string") {
      const cleanHarga = harga.replace(/[^0-9]/g, "");
      hargaNum = parseInt(cleanHarga);
    } else if (typeof harga === "number") {
      hargaNum = harga;
    } else {
      return res.status(400).json({ 
        message: "Harga harus berupa angka (contoh: 25000000)" 
      });
    }

    if (isNaN(hargaNum) || hargaNum <= 0) {
      return res.status(400).json({ 
        message: "Harga harus berupa angka positif (contoh: 25000000)" 
      });
    }

    const result = await produkModel.insertProduk({
      nama_produk,
      deskripsi,
      harga,
      gambar: gambar,
      kategori
    });

    res.status(201).json({
      message: "Produk berhasil ditambahkan",
      data: { id_produk: result.insertId, nama_produk, kategori }
    });
  } catch (error) {
    console.error("Create produk error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const updateProduk = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_produk, deskripsi, harga, kategori } = req.body;
    
   const existing = await produkModel.findProdukById(id);
    if (!existing) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    let gambar = null;
    
    if (req.file) {
      gambar = req.file.filename;
    } else if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'gambar');
      if (file) {
        gambar = file.filename;
      }
    }

    if (!nama_produk || !deskripsi || !harga || !kategori) {
      return res.status(400).json({ 
        message: "Semua field wajib diisi (nama_produk, deskripsi, harga, kategori)" 
      });
    }

    if (!validCategories.includes(kategori)) {
      return res.status(400).json({ 
        message: `Kategori tidak valid. Pilih salah satu: ${validCategories.join(", ")}` 
      });
    }

    let hargaNum;
    if (typeof harga === "string") {
      const cleanHarga = harga.replace(/[^0-9]/g, "");
      hargaNum = parseInt(cleanHarga);
    } else if (typeof harga === "number") {
      hargaNum = harga;
    } else {
      return res.status(400).json({ 
        message: "Harga harus berupa angka (contoh: 25000000)" 
      });
    }

    if (isNaN(hargaNum) || hargaNum <= 0) {
      return res.status(400).json({ 
        message: "Harga harus berupa angka positif (contoh: 25000000)" 
      });
    }

    const gambarFinal = gambar !== null ? gambar : existing.gambar;

      await produkModel.updateProduk(id, {
      nama_produk,
      deskripsi,
      harga: hargaNum,
      gambar: gambarFinal,
      kategori
    });

    res.status(200).json({
      message: "Produk berhasil diupdate",
      data: { id_produk: id, nama_produk, kategori, gambar: gambarFinal }
    });
  } catch (error) {
    console.error("Update produk error:", error);
    res.status(500).json({ 
      message: "Terjadi kesalahan server",
      error: error.message 
    });
  }
};

// Delete produk
const deleteProduk = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek produk ada
    const existing = await produkModel.findProdukById(id);
    if (!existing) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    await produkModel.deleteProduk(id);

    res.status(200).json({
      message: "Produk berhasil dihapus"
    });
  } catch (error) {
    console.error("Delete produk error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ==================== KELOLA PEMBELI / USERS ====================

// List semua user (hanya role pembeli)
const listPembeli = async (req, res) => {
  try {
    const db = require("../config/db");
    const [rows] = await db.query(
      `SELECT id, nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, foto, created_at, updated_at 
       FROM users WHERE role = 'pembeli' ORDER BY created_at DESC`
    );
    res.status(200).json({
      message: "Berhasil mengambil data pembeli",
      data: rows
    });
  } catch (error) {
    console.error("List pembeli error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get pembeli by ID
const getPembeliById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersModel.findUserById(id);
    
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    
    if (user.role !== "pembeli") {
      return res.status(400).json({ message: "User bukan pembeli" });
    }
    
    res.status(200).json({
      message: "Berhasil mengambil data pembeli",
      data: user
    });
  } catch (error) {
    console.error("Get pembeli error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Create pembeli baru (admin buatkan akun)
const createPembeli = async (req, res) => {
  try {
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, passwd } = req.body;

    // Validasi wajib
     if (!nama_d || !nama_b || !email || !uname || !passwd) {
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
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const hashedPasswd = await bcrypt.hash(passwd, saltRounds);

    const foto = req.file ? req.file.filename : "default.jpg";

    let lahirFormatted = null;
    if (lahir && lahir.trim() !== '') {
      try {
        const date = new Date(lahir);
        if (!isNaN(date.getTime())) {
          lahirFormatted = date.toISOString().split('T')[0];
        }
      } catch (e) {
        console.log("⚠️ Gagal format tanggal:", lahir);
      }
    }

    const result = await usersModel.createUser({
      nama_d,
      nama_b,
      kelamin: kelamin || 'Laki-laki',
      lahir: lahirFormatted,
      alamat: alamat || '',
      phone: phone || '',
      email,
      uname,
      passwd: hashedPasswd,
      foto
    });

    res.status(201).json({
      message: "Pembeli berhasil ditambahkan",
      data: { id: result.insertId, email, uname }
    });
  } catch (error) {
    console.error("Create pembeli error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Update pembeli (admin)
const updatePembeli = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, role, passwd } = req.body;

    // Cek user ada
    const user = await usersModel.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (user.role !== "pembeli") {
      return res.status(400).json({ message: "User bukan pembeli" });
    }

    // Validasi wajib
    if (!nama_d || !nama_b || !email || !uname) {
      return res.status(400).json({ 
        message: "Nama depan, nama belakang, email, dan username wajib diisi" 
      });
    }

    // Ambil foto dari req.files
    let foto = user.foto; // default pakai foto lama
    if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'foto' || f.fieldname === 'gambar');
      if (file) {
        foto = file.filename;

      }
    }

    // Format tanggal
    let lahirFormatted = null;
    if (lahir && lahir.trim() !== '') {
      try {
        const date = new Date(lahir);
        if (!isNaN(date.getTime())) {
          lahirFormatted = date.toISOString().split('T')[0];
        }
      } catch (e) {
        console.log("⚠️ Gagal format tanggal:", lahir);
      }
    }

    // Update data user
    await usersModel.updateUserProfile(id, {
      nama_d,
      nama_b,
      kelamin: kelamin || user.kelamin || 'Laki-laki',
      lahir: lahirFormatted,
      alamat: alamat || user.alamat || '',
      phone: phone || user.phone || '',
      email: email || user.email,
      foto: foto
    });

    // Jika ada password baru, update password
    if (passwd && passwd.trim() !== '') {
      const bcrypt = require("bcrypt");
      const hashedPasswd = await bcrypt.hash(passwd, 10);
      const db = require("../config/db");
      await db.query(`UPDATE users SET passwd = ? WHERE id = ?`, [hashedPasswd, id]);
      console.log("🔑 Password diupdate");
    }

    // Update role jika diubah
    if (role && role !== user.role) {
      const db = require("../config/db");
      await db.query(`UPDATE users SET role = ? WHERE id = ?`, [role, id]);
    }

    res.status(200).json({
      message: "Data pembeli berhasil diupdate"
    });

  } catch (error) {
    console.error("Update pembeli error:", error);
    res.status(500).json({ 
      message: "Terjadi kesalahan server",
      error: error.message 
    });
  }
};

// Delete pembeli (admin)
const deletePembeli = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek user ada
    const user = await usersModel.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (user.role !== "pembeli") {
      return res.status(400).json({ message: "User bukan pembeli" });
    }

    // Hapus user (pakai query langsung karena usersModel belum ada deleteUser)
    const db = require("../config/db");
    await db.query(`DELETE FROM users WHERE id = ?`, [id]);

    res.status(200).json({
      message: "Pembeli berhasil dihapus"
    });
  } catch (error) {
    console.error("Delete pembeli error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ==================== CRUD ARTIKEL ====================

// List semua artikel
const listArtikel = async (req, res) => {
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

// Get artikel by ID
const getArtikelById = async (req, res) => {
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

// Create artikel baru
const createArtikel = async (req, res) => {
  try {
    const { judul, ringkasan, isi } = req.body;

    // Validasi wajib
    if (!judul || !ringkasan || !isi ) {
      return res.status(400).json({ message: "Semua field wajib diisi (judul, ringkasan, isi, gambar)" });
    }

    let gambar = null;
    if (req.file) {
      gambar = req.file.filename;
    } else if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'gambar');
      if (file) {
        gambar = file.filename;
      }
    }

    const result = await artikelModel.insertArtikel({
      judul,
      ringkasan,
      isi,
      gambar
    });

    res.status(201).json({
      message: "Artikel berhasil ditambahkan",
      data: { id: result.insertId, judul }
    });
  } catch (error) {
    console.error("Create artikel error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Update artikel
const updateArtikel = async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, ringkasan, isi } = req.body;

    // Cek artikel ada
    const existing = await artikelModel.findArtikelById(id);
    if (!existing) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    // Validasi field
    if (!judul || !ringkasan || !isi) {
      return res.status(400).json({ message: "Semua field wajib diisi (judul, ringkasan, isi, gambar)" });
    }

    let gambar = null;
    if (req.file) {
      gambar = req.file.filename;
    } else if (req.files && req.files.length > 0) {
      const file = req.files.find(f => f.fieldname === 'gambar');
      if (file) {
        gambar = file.filename;
      }
    }

    await artikelModel.updateArtikel(id, {
      judul,
      ringkasan,
      isi,
      gambar
    });

    res.status(200).json({
      message: "Artikel berhasil diupdate",
      data: { id, judul }
    });
  } catch (error) {
    console.error("Update artikel error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Delete artikel
const deleteArtikel = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek artikel ada
    const existing = await artikelModel.findArtikelById(id);
    if (!existing) {
      return res.status(404).json({ message: "Artikel tidak ditemukan" });
    }

    await artikelModel.deleteArtikel(id);

    res.status(200).json({
      message: "Artikel berhasil dihapus"
    });
  } catch (error) {
    console.error("Delete artikel error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ==================== STATISTIK ====================

const getStats = async (req, res) => {
  try {
    const db = require("../config/db");

    // 1. Total Pembeli
    const [pembeliResult] = await db.query(
      `SELECT COUNT(*) as total FROM users WHERE role = 'pembeli'`
    );

    // 2. Total Produk
    const [produkResult] = await db.query(
      `SELECT COUNT(*) as total FROM produk`
    );

    // 3. Total Artikel
    const [artikelResult] = await db.query(
      `SELECT COUNT(*) as total FROM artikel`
    );

    // 4. Statistik Pembelian
    const [pembelianRows] = await db.query(
      `SELECT 
         COUNT(*) as total_pembelian,
         SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) as selesai,
         SUM(CASE WHEN status = 'Diterima' THEN 1 ELSE 0 END) as diterima,
         SUM(CASE WHEN status = 'Dikirim' THEN 1 ELSE 0 END) as dikirim,
         SUM(CASE WHEN status = 'Dikemas' THEN 1 ELSE 0 END) as dikemas,
         SUM(CASE WHEN status = 'Tertunda' THEN 1 ELSE 0 END) as tertunda,
         SUM(CASE WHEN pembayaran = 'Dibayar' THEN 1 ELSE 0 END) as dibayar,
         SUM(CASE WHEN pembayaran = 'Belum' THEN 1 ELSE 0 END) as belum_bayar
       FROM pembelian`
    );
    const statsPembelian = pembelianRows[0] || {};

    // 5. Hitung pesanan aktif
    const pesananAktif = 
      Number(statsPembelian.tertunda || 0) + 
      Number(statsPembelian.dikemas || 0) + 
      Number(statsPembelian.dikirim || 0) +
      Number(statsPembelian.diterima || 0);

    // 6. Produk Terjual
    const produkTerjual = Number(statsPembelian.total_pembelian || 0);

    // 7. Pendapatan (Join dengan harga produk)
    const [pendapatanResult] = await db.query(
      `SELECT SUM(pr.harga) as total 
       FROM pembelian p 
       LEFT JOIN produk pr ON p.id_produk = pr.id_produk 
       WHERE p.pembayaran = 'Dibayar'`
    );

    // 8. Recent Pembelian (TAMBAHKAN pr.harga AS produk_harga)
    const [recent] = await db.query(
      `SELECT p.*, 
              u.nama_d as user_nama_d, u.nama_b as user_nama_b,
              pr.nama_produk, pr.harga as produk_harga
       FROM pembelian p
       LEFT JOIN users u ON p.id_pembeli = u.id
       LEFT JOIN produk pr ON p.id_produk = pr.id_produk
       ORDER BY p.created_at DESC
       LIMIT 5`
    );

    const stats = {
      total_pembeli: Number(pembeliResult[0]?.total || 0),
      total_produk: Number(produkResult[0]?.total || 0),
      total_artikel: Number(artikelResult[0]?.total || 0),
      total_pembelian: Number(statsPembelian.total_pembelian || 0),
      total_terjual: produkTerjual,
      pesanan_aktif: pesananAktif,
      belum_dibayar: Number(statsPembelian.belum_bayar || 0),
      dikirim: Number(statsPembelian.dikirim || 0),
      pendapatan: Number(pendapatanResult[0]?.total || 0),
      selesai: Number(statsPembelian.selesai || 0),
      diterima: Number(statsPembelian.diterima || 0),
      dikemas: Number(statsPembelian.dikemas || 0),
      tertunda: Number(statsPembelian.tertunda || 0),
      dibayar: Number(statsPembelian.dibayar || 0),
    };

    res.status(200).json({
      message: "Berhasil mengambil data statistik",
      data: {
        stats,
        recent_pembelian: recent
      }
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// ==================== CRUD PEMBELIAN ====================

// List semua pembelian
const listPembelian = async (req, res) => {
  try {
    const pembelian = await pembelianModel.findAllPembelianWithDetail();
    res.status(200).json({
      message: "Berhasil mengambil data pembelian",
      data: pembelian
    });
  } catch (error) {
    console.error("List pembelian error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get pembelian by ID
const getPembelianById = async (req, res) => {
  try {
    const { id } = req.params;
    const pembelian = await pembelianModel.findPembelianById(id);
    
    if (!pembelian) {
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });
    }
    
    res.status(200).json({
      message: "Berhasil mengambil data pembelian",
      data: pembelian
    });
  } catch (error) {
    console.error("Get pembelian error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Update pembelian (admin)
const updatePembelian = async (req, res) => {
  try {
    const { id } = req.params;
    const { metode_pembayaran, pembayaran, pengiriman, status, catatan } = req.body;

    // Cek pembelian ada
    const existing = await pembelianModel.findPembelianById(id);
    if (!existing) {
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });
    }

    // Validasi status
    const validStatus = ["Tertunda", "Dikemas", "Dikirim", "Diterima", "Selesai"];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ 
        message: `Status tidak valid. Pilih salah satu: ${validStatus.join(", ")}` 
      });
    }

    // Validasi pembayaran
    const validPembayaran = ["Belum", "Dibayar"];
    if (pembayaran && !validPembayaran.includes(pembayaran)) {
      return res.status(400).json({ 
        message: `Pembayaran tidak valid. Pilih salah satu: ${validPembayaran.join(", ")}` 
      });
    }

    // Validasi metode pembayaran
    const validMetode = ["Bank Transfer", "COD"];
    if (metode_pembayaran && !validMetode.includes(metode_pembayaran)) {
      return res.status(400).json({ 
        message: `Metode pembayaran tidak valid. Pilih salah satu: ${validMetode.join(", ")}` 
      });
    }

    // Validasi pengiriman
    const validPengiriman = ["JNT Express", "JNE"];
    if (pengiriman && !validPengiriman.includes(pengiriman)) {
      return res.status(400).json({ 
        message: `Pengiriman tidak valid. Pilih salah satu: ${validPengiriman.join(", ")}` 
      });
    }

    const targetStatus = status || existing.status;
    const targetPembayaran = pembayaran || existing.pembayaran;

    if (targetStatus === "Selesai" && targetPembayaran !== "Dibayar") {
      return res.status(400).json({ 
        message: "Status pesanan tidak bisa diubah menjadi 'Selesai' karena pembayaran masih 'Belum'." 
      });
    }

    await pembelianModel.updatePembelian(id, {
      metode_pembayaran: metode_pembayaran || existing.metode_pembayaran,
      pembayaran: pembayaran || existing.pembayaran,
      pengiriman: pengiriman || existing.pengiriman,
      status: status || existing.status,
      catatan: catatan !== undefined ? catatan : existing.catatan
    });

    res.status(200).json({
      message: "Pembelian berhasil diupdate",
      data: { id }
    });
  } catch (error) {
    console.error("Update pembelian error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Delete pembelian (admin)
const deletePembelian = async (req, res) => {
  try {
    const { id } = req.params;

    // Cek pembelian ada
    const existing = await pembelianModel.findPembelianById(id);
    if (!existing) {
      return res.status(404).json({ message: "Pembelian tidak ditemukan" });
    }

    await pembelianModel.deletePembelian(id);

    res.status(200).json({
      message: "Pembelian berhasil dihapus"
    });
  } catch (error) {
    console.error("Delete pembelian error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = {
  // Produk
  listProduk,
  getProdukById,
  createProduk,
  updateProduk,
  deleteProduk,
  // Pembeli
  listPembeli,
  getPembeliById,
  createPembeli,
  updatePembeli,
  deletePembeli,
  // Artikel
  listArtikel,
  getArtikelById,
  createArtikel,
  updateArtikel,
  deleteArtikel,
  // Statistik
  getStats,
  // Pembelian
  listPembelian,
  getPembelianById,
  updatePembelian,
  deletePembelian
};