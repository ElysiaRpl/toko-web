// backend/models/artikelModel.js
const db = require("../config/db");

/**
 * Ambil semua artikel
 * @returns {Promise<Array>} Daftar seluruh artikel
 */
const findAllArtikel = async () => {
  const [rows] = await db.query(
    `SELECT * FROM artikel ORDER BY created_at DESC`
  );
  return rows;
};

/**
 * Cari artikel berdasarkan ID
 * @param {number|string} id - ID artikel yang dicari
 * @returns {Promise<Object|undefined>} Data artikel jika ditemukan
 */
const findArtikelById = async (id) => {
  const [rows] = await db.query(
    `SELECT * FROM artikel WHERE id = ?`,
    [id]
  );
  return rows[0];
};

/**
 * Tambah artikel baru
 * @param {Object} artikelData - Data artikel baru
 * @param {string} artikelData.judul - Judul artikel
 * @param {string} artikelData.ringkasan - Ringkasan artikel
 * @param {string} artikelData.isi - Konten lengkap artikel
 * @param {string} artikelData.gambar - Path atau URL gambar artikel
 * @returns {Promise<Object>} Hasil eksekusi query insert
 */
const insertArtikel = async (artikelData) => {
  const { judul, ringkasan, isi, gambar } = artikelData;
  const [result] = await db.query(
    `INSERT INTO artikel (judul, ringkasan, isi, gambar) 
     VALUES (?, ?, ?, ?)`,
    [judul, ringkasan, isi, gambar]
  );
  return result;
};

/**
 * Update artikel
 * @param {number|string} id - ID artikel yang akan diperbarui
 * @param {Object} artikelData - Data artikel yang diperbarui
 * @param {string} artikelData.judul - Judul artikel baru
 * @param {string} artikelData.ringkasan - Ringkasan artikel baru
 * @param {string} artikelData.isi - Konten artikel baru
 * @param {string} artikelData.gambar - Path atau URL gambar artikel baru
 * @returns {Promise<Object>} Hasil eksekusi query update
 */
const updateArtikel = async (id, artikelData) => {
  const { judul, ringkasan, isi, gambar } = artikelData;
  const [result] = await db.query(
    `UPDATE artikel 
     SET judul = ?, ringkasan = ?, isi = ?, gambar = ?
     WHERE id = ?`,
    [judul, ringkasan, isi, gambar, id]
  );
  return result;
};

/**
 * Hapus artikel
 * @param {number|string} id - ID artikel yang akan dihapus
 * @returns {Promise<Object>} Hasil eksekusi query delete
 */
const deleteArtikel = async (id) => {
  const [result] = await db.query(
    `DELETE FROM artikel WHERE id = ?`,
    [id]
  );
  return result;
};

module.exports = {
  findAllArtikel,
  findArtikelById,
  insertArtikel,
  updateArtikel,
  deleteArtikel
};