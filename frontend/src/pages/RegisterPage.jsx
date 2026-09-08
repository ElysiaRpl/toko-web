// frontend/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SITE, KELAMIN } from '../constants';
import { mediaUrl, onImgError } from '../utils';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nama_d: '',
    nama_b: '',
    kelamin: 'Laki-laki',
    lahir: '',
    alamat: '',
    phone: '',
    email: '',
    uname: '',
    passwd: '',
    passwd_confirm: '',
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Validasi
    if (!formData.nama_d || !formData.nama_b || !formData.email || !formData.uname || !formData.passwd) {
      setErrorMsg('Nama depan, nama belakang, email, username, dan password wajib diisi!');
      return;
    }

    if (formData.passwd.length < 6) {
      setErrorMsg('Password minimal 6 karakter!');
      return;
    }

    if (formData.passwd !== formData.passwd_confirm) {
      setErrorMsg('Konfirmasi password tidak cocok!');
      return;
    }

    try {
      setSubmitting(true);

      // Kirim sebagai FormData (untuk upload foto)
      const dataPayload = new FormData();
      dataPayload.append('nama_d', formData.nama_d);
      dataPayload.append('nama_b', formData.nama_b);
      dataPayload.append('kelamin', formData.kelamin);
      dataPayload.append('lahir', formData.lahir || '');
      dataPayload.append('alamat', formData.alamat || '');
      dataPayload.append('phone', formData.phone || '');
      dataPayload.append('email', formData.email);
      dataPayload.append('uname', formData.uname);
      dataPayload.append('passwd', formData.passwd);

      if (fotoFile) {
        dataPayload.append('foto', fotoFile);
      }

      // Panggil API register (pakai fetch langsung karena FormData)
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        body: dataPayload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mendaftar');
      }

      setSuccessMsg('Pendaftaran berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Register error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan pada server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center min-vh-100 py-4" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="card border-0 shadow-lg rounded-4 p-4" style={{ maxWidth: '520px', width: '100%' }}>
          <div className="text-center mb-3">
            <p className="display-6 fw-bold" style={{ color: '#2A1E17', fontFamily: 'serif' }}>{SITE.nama_toko}</p>
            <p className="text-muted small">Buat akun untuk berbelanja dan mengelola profil Anda.</p>
          </div>

          {/* Alert */}
          {errorMsg && (
            <div className="alert alert-danger py-2 px-3 small" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success py-2 px-3 small" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              <div className="col-md-6">
                <label htmlFor='Nama Depan' className="form-label fw-semibold text-dark small">Nama Depan <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="nama_d" value={formData.nama_d} onChange={handleChange} placeholder="Nama depan" required />
              </div>
              <div className="col-md-6">
                <label htmlFor='Nama Belakang' className="form-label fw-semibold text-dark small">Nama Belakang <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="nama_b" value={formData.nama_b} onChange={handleChange} placeholder="Nama belakang" required />
              </div>
            </div>
            <div className="row g-2 mt-1">
              <div className="col-md-6">
                <label htmlFor='Jenis Kelamin' className=" form-label fw-semibold text-dark small">Jenis Kelamin</label>
                <select className="form-select form-select-sm" name="kelamin" value={formData.kelamin} onChange={handleChange}>
                  {KELAMIN.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor='Tanggal Lahir' className="form-label fw-semibold text-dark small">Tanggal Lahir</label>
                <input type="text" className="form-control form-control-sm" name="lahir" value={formData.lahir} onChange={handleChange} placeholder="Ponorogo, 26 July 2016"/>
              </div>
            </div>

            <div className="row g-2 mt-1">
              <div className="col-md-6">
                <label htmlFor='Email' className="form-label fw-semibold text-dark small">Email <span className="text-danger">*</span></label>
                <input type="email" className="form-control form-control-sm" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" required />
              </div>
              <div className="col-md-6">
                <label htmlFor='Username' className="form-label fw-semibold text-dark small">Username <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="uname" value={formData.uname} onChange={handleChange} placeholder="username" required />
              </div>
            </div>

            <div className="row g-2 mt-1">
              <div className="col-md-6">
                <label htmlFor='Password' className="form-label fw-semibold text-dark small">Password <span className="text-danger">*</span></label>
                <input type="password" className="form-control form-control-sm" name="passwd" value={formData.passwd} onChange={handleChange} placeholder="Minimal 6 karakter" required />
              </div>

              <div className="col-md-6">
                <label htmlFor='Konfirmasi Password' className="form-label fw-semibold text-dark small">Konfirmasi Password <span className="text-danger">*</span></label>
                <input type="password" className="form-control form-control-sm" name="passwd_confirm" value={formData.passwd_confirm} onChange={handleChange} placeholder="Ulangi password" required />
              </div>
            </div>

            <div className="mt-2">
              <label htmlFor='Alamat' className="form-label fw-semibold text-dark small">Alamat</label>
              <textarea className="form-control form-control-sm" rows="2" name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Alamat lengkap..." />
            </div>

            <div className="mt-2">
              <label htmlFor='Nomor Telepon' className="form-label fw-semibold text-dark small">Nomor Telepon</label>
              <input type="bigin" className="form-control form-control-sm" name="phone" value={formData.phone} onChange={handleChange} placeholder="" />
            </div>

          <div className="mt-2">
              <label htmlFor='Foto Profil' className="form-label fw-semibold text-dark small">Foto Profil (Opsional)</label>
              <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange} />
              <p className="text-muted fs-6"> Format: jpg, png, gif, webp (maks 5MB)</p>
            </div>

            {preview && (
              <div className="mt-2">
                <p className="form-label fw-semibold text-dark small mb-1">Preview Foto:</p>
                <div className="border rounded p-1 d-inline-block bg-light">
                  <img src={preview} alt="Preview" className="rounded-circle" style={{ width: '80px', height: '80px', objectFit: 'cover' }} onError={onImgError} />
                </div>
              </div>
            )}

            <button type="submit" className="btn text-white w-100 fw-bold py-2 mt-3 rounded-3 shadow-sm" style={{ backgroundColor: '#D8838B' }} disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Mendaftar...
                </>
              ) : (
              'Daftar'
              )}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="text-muted small mb-0"> Sudah punya akun?{' '} <Link to="/login" className="fw-bold text-decoration-none" style={{ color: '#D8838B' }}> Login </Link></p>
          </div>

          <div className="text-center mt-2">
            <small className="text-muted"> &copy; {new Date().getFullYear()} {SITE.nama_toko}</small>
          </div>
        </div>
      </div>
    </>
  );
}