// backend/models/produkModel.js
const db = require("../config/db");

// Ambil semua produk
const findAllProduk = async () => {
  const [rows] = await db.query(
    `SELECT * FROM produk ORDER BY created_at DESC`
  );
  return rows;
};

// Cari produk berdasarkan ID
const findProdukById = async (id_produk) => {
  const [rows] = await db.query(
    `SELECT * FROM produk WHERE id_produk = ?`,
    [id_produk]
  );
  return rows[0];
};

// Tambah produk baru
const insertProduk = async (produkData) => {
  const { nama_produk, deskripsi, harga, gambar, kategori } = produkData;
  const [result] = await db.query(
    `INSERT INTO produk (nama_produk, deskripsi, harga, gambar, kategori) 
     VALUES (?, ?, ?, ?, ?)`,
    [nama_produk, deskripsi, harga, gambar || null, kategori]
  );
  return result;
};

// Update produk
const updateProduk = async (id_produk, produkData) => {
  const { nama_produk, deskripsi, harga, gambar, kategori } = produkData;
  const [result] = await db.query(
    `UPDATE produk 
     SET nama_produk = ?, deskripsi = ?, harga = ?, gambar = COALESCE(?, gambar), kategori = ?
     WHERE id_produk = ?`,
    [nama_produk, deskripsi, harga, gambar || null, kategori, id_produk]
  );
  return result;
};

// Hapus produk
const deleteProduk = async (id_produk) => {
  const [result] = await db.query(
    `DELETE FROM produk WHERE id_produk = ?`,
    [id_produk]
  );
  return result;
};

module.exports = {
  findAllProduk,
  findProdukById,
  insertProduk,
  updateProduk,
  deleteProduk
};