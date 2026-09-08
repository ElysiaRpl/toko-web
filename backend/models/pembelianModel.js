// backend/models/pembelianModel.js
const db = require("../config/db");

// Ambil semua pembelian dengan detail user & produk (admin)
const findAllPembelianWithDetail = async () => {
  const [rows] = await db.query(
    `SELECT p.*, 
            u.nama_d as user_nama_d, u.nama_b as user_nama_b, u.email as user_email, u.foto as user_foto,
            pr.nama_produk, pr.harga as produk_harga, pr.gambar as produk_gambar
     FROM pembelian p
     LEFT JOIN users u ON p.id_pembeli = u.id
     LEFT JOIN produk pr ON p.id_produk = pr.id_produk
     ORDER BY p.created_at DESC`
  );
  return rows;
};

// Cari pembelian berdasarkan ID (admin)
const findPembelianById = async (id) => {
  const [rows] = await db.query(
    `SELECT p.*, 
            u.nama_d as user_nama_d, u.nama_b as user_nama_b, u.email as user_email, u.phone as user_phone, u.foto as user_foto,
            pr.nama_produk, pr.harga as produk_harga, pr.gambar as produk_gambar
     FROM pembelian p
     LEFT JOIN users u ON p.id_pembeli = u.id
     LEFT JOIN produk pr ON p.id_produk = pr.id_produk
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
};

// Update pembelian (admin)
const updatePembelian = async (id, data) => {
  const { metode_pembayaran, pembayaran, pengiriman, status, catatan } = data;
  const [result] = await db.query(
    `UPDATE pembelian 
     SET metode_pembayaran = ?, pembayaran = ?, pengiriman = ?, status = ?, catatan = ?
     WHERE id = ?`,
    [metode_pembayaran, pembayaran, pengiriman, status, catatan, id]
  );
  return result;
};

// Hapus pembelian (admin)
const deletePembelian = async (id) => {
  const [result] = await db.query(
    `DELETE FROM pembelian WHERE id = ?`,
    [id]
  );
  return result;
};

// Tambah pembelian baru (pembeli)
const insertPembelian = async (data) => {
  const { 
    id_pembeli, id_produk, nama_pembeli, alamat_pembeli, 
    phone_pembeli, metode_pembayaran, catatan, foto_bukti 
  } = data;
  const [result] = await db.query(
    `INSERT INTO pembelian 
     (id_pembeli, id_produk, nama_pembeli, alamat_pembeli, phone_pembeli, 
      metode_pembayaran, catatan, foto_bukti) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id_pembeli, id_produk, nama_pembeli, alamat_pembeli, 
     phone_pembeli, metode_pembayaran, catatan, foto_bukti || null]
  );
  return result;
};

// Ambil pembelian berdasarkan id_pembeli dengan detail (pembeli)
const findPembelianByPembeliIdWithDetail = async (id_pembeli) => {
  const [rows] = await db.query(
    `SELECT p.*, 
            pr.nama_produk, pr.harga as produk_harga, pr.gambar as produk_gambar
     FROM pembelian p
     LEFT JOIN produk pr ON p.id_produk = pr.id_produk
     WHERE p.id_pembeli = ?
     ORDER BY p.created_at DESC`,
    [id_pembeli]
  );
  return rows;
};

// Cari pembelian berdasarkan ID dan id_pembeli (pembeli cek milik sendiri)
const findPembelianByIdAndPembeliId = async (id, id_pembeli) => {
  const [rows] = await db.query(
    `SELECT p.*, 
            pr.nama_produk, pr.harga as produk_harga, pr.gambar as produk_gambar
     FROM pembelian p
     LEFT JOIN produk pr ON p.id_produk = pr.id_produk
     WHERE p.id = ? AND p.id_pembeli = ?`,
    [id, id_pembeli]
  );
  return rows[0];
};

// Statistik pembelian per pembeli
const getStatsByPembeliId = async (id_pembeli) => {
  const [rows] = await db.query(
    `SELECT 
       COUNT(*) as total_pembelian,
       CAST(SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) AS UNSIGNED) as selesai,
       CAST(SUM(CASE WHEN status = 'Diterima' THEN 1 ELSE 0 END) AS UNSIGNED) as diterima,
       CAST(SUM(CASE WHEN status = 'Dikirim' THEN 1 ELSE 0 END) AS UNSIGNED) as dikirim,
       CAST(SUM(CASE WHEN status = 'Dikemas' THEN 1 ELSE 0 END) AS UNSIGNED) as dikemas,
       CAST(SUM(CASE WHEN status = 'Tertunda' THEN 1 ELSE 0 END) AS UNSIGNED) as tertunda,
       CAST(SUM(CASE WHEN pembayaran = 'Belum' THEN 1 ELSE 0 END) AS UNSIGNED) as belum_bayar
     FROM pembelian
     WHERE id_pembeli = ?`,
    [id_pembeli]
  );
  
  const data = rows[0] || {};
  return {
    total_pembelian: Number(data.total_pembelian || 0),
    selesai: Number(data.selesai || 0),
    diterima: Number(data.diterima || 0),
    dikirim: Number(data.dikirim || 0),
    dikemas: Number(data.dikemas || 0),
    tertunda: Number(data.tertunda || 0),
    belum_bayar: Number(data.belum_bayar || 0),
  };
};

// Statistik admin (semua pembelian)
const getAdminStats = async () => {
  const [rows] = await db.query(
    `SELECT 
       COUNT(*) as total_pembelian,
       CAST(SUM(CASE WHEN status = 'Selesai' THEN 1 ELSE 0 END) AS UNSIGNED) as selesai,
       CAST(SUM(CASE WHEN status = 'Diterima' THEN 1 ELSE 0 END) AS UNSIGNED) as diterima,
       CAST(SUM(CASE WHEN status = 'Dikirim' THEN 1 ELSE 0 END) AS UNSIGNED) as dikirim,
       CAST(SUM(CASE WHEN status = 'Dikemas' THEN 1 ELSE 0 END) AS UNSIGNED) as dikemas,
       CAST(SUM(CASE WHEN status = 'Tertunda' THEN 1 ELSE 0 END) AS UNSIGNED) as tertunda,
       CAST(SUM(CASE WHEN pembayaran = 'Dibayar' THEN 1 ELSE 0 END) AS UNSIGNED) as dibayar,
       CAST(SUM(CASE WHEN pembayaran = 'Belum' THEN 1 ELSE 0 END) AS UNSIGNED) as belum_bayar
     FROM pembelian`
  );

  const data = rows[0] || {};
  return {
    total_pembelian: Number(data.total_pembelian || 0),
    selesai: Number(data.selesai || 0),
    diterima: Number(data.diterima || 0),
    dikirim: Number(data.dikirim || 0),
    dikemas: Number(data.dikemas || 0),
    tertunda: Number(data.tertunda || 0),
    dibayar: Number(data.dibayar || 0),
    belum_bayar: Number(data.belum_bayar || 0),
  };
};

// Ambil 5 pembelian terbaru (admin dashboard)
const getRecentPembelian = async (limit = 5) => {
  const [rows] = await db.query(
    `SELECT p.*, 
            u.nama_d as user_nama_d, u.nama_b as user_nama_b, u.foto as user_foto,
            pr.nama_produk
     FROM pembelian p
     LEFT JOIN users u ON p.id_pembeli = u.id
     LEFT JOIN produk pr ON p.id_produk = pr.id_produk
     ORDER BY p.created_at DESC
     LIMIT ?`,
    [limit]
  );
  return rows;
};

module.exports = {
  findAllPembelianWithDetail,
  findPembelianById,
  updatePembelian,
  deletePembelian,
  insertPembelian,
  findPembelianByPembeliIdWithDetail,
  findPembelianByIdAndPembeliId,
  getStatsByPembeliId,
  getAdminStats,
  getRecentPembelian
};