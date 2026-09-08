const db = require("../config/db");

const createUser = async (userData) => {
  const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, passwd, foto } = userData;
  const [result] = await db.query(
    `INSERT INTO users (nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, passwd, foto) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [nama_d, nama_b, kelamin, lahir, alamat, phone, email, uname, passwd, foto]
  );
  return result;
};

const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );
  return rows[0];
};

const findUserByCredential = async (credential) => {
  const [rows] = await db.query(
    `SELECT * FROM users WHERE email = ? OR uname = ?`,
    [credential, credential]
  );
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, foto, created_at, updated_at 
     FROM users WHERE id = ?`,
    [id]
  );
  return rows[0];
};

const findPasswdHashById = async (id) => {
  const [rows] = await db.query(
    `SELECT passwd FROM users WHERE id = ?`,
    [id]
  );
  return rows[0]?.passwd;
};

const updateUserProfile = async (id, userData) => {
  const { nama_d, nama_b, kelamin, lahir, alamat, phone, email, foto } = userData;
  const [result] = await db.query(
    `UPDATE users 
     SET nama_d = ?, nama_b = ?, kelamin = ?, lahir = ?, alamat = ?, phone = ?, email = ?, foto = ?
     WHERE id = ?`,
    [nama_d, nama_b, kelamin, lahir, alamat, phone, email, foto, id]
  );
  return result;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByCredential,
  findUserById,
  findPasswdHashById,
  updateUserProfile
};