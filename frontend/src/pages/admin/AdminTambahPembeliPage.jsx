// frontend/src/pages/admin/AdminTambahPembeliPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken } from '../../utils';
import { KELAMIN } from '../../constants';

export default function AdminTambahPembeliPage() {
  const navigate = useNavigate();

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
    role: 'pembeli',
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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

  if (!formData.nama_d || !formData.nama_b || !formData.email || !formData.uname || !formData.passwd) {
    setErrorMsg('Nama depan, nama belakang, email, username, dan password wajib diisi!');
    return;
  }

  try {
    setSubmitting(true);
    const token = getToken();

    const dataPayload = new FormData();
    dataPayload.append('nama_d', formData.nama_d);
    dataPayload.append('nama_b', formData.nama_b);
    dataPayload.append('kelamin', formData.kelamin || 'Laki-laki');
    dataPayload.append('lahir', formData.lahir || '');
    dataPayload.append('alamat', formData.alamat || '');
    dataPayload.append('phone', formData.phone || '');
    dataPayload.append('email', formData.email);
    dataPayload.append('uname', formData.uname);
    dataPayload.append('passwd', formData.passwd);
    dataPayload.append('role', formData.role || 'pembeli');

    if (fotoFile) {
      dataPayload.append('gambar', fotoFile);
    }

    const response = await fetch('http://localhost:5000/api/admin/pembeli', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: dataPayload,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal menambahkan pembeli baru');
    }

    navigate('/admin/pembeli');
  } catch (err) {
    console.error('Error:', err);
    setErrorMsg(err.message || 'Terjadi kesalahan pada server');
  } finally {
    setSubmitting(false);
  }
};

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1 fs-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Tambah Pembeli Baru</p>
            <p className="text-muted small mb-0">Masukkan informasi akun pembeli baru ke sistem.</p>
          </div>
          <Link to="/admin/pembeli" className="btn btn-sm px-3 py-1 fw-semibold rounded-3" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>Kembali</Link>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="card border-0 shadow-sm bg-white p-4 rounded-3">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nama Depan <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="nama_d" value={formData.nama_d} onChange={handleChange} placeholder="Masukkan nama depan" required/>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nama Belakang <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm"
                  name="nama_b" value={formData.nama_b} onChange={handleChange} placeholder="Masukkan nama belakang" required/>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Jenis Kelamin</label>
                <select className="form-select form-select-sm" name="kelamin" value={formData.kelamin} onChange={handleChange}>
                  {KELAMIN.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Tanggal Lahir</label>
                <input type="text" className="form-control form-control-sm" name="lahir" value={formData.lahir} onChange={handleChange} />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor='NomorTelpon' className="form-label fw-semibold text-dark small">Nomor Telepon</label>
                <input type="bigin" className="form-control form-control-sm" name="phone" value={formData.phone} onChange={handleChange} placeholder="+62xxxxxxxxxx" />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Email <span className="text-danger">*</span></label>
                <input type="email" className="form-control form-control-sm" name="email" value={formData.email} onChange={handleChange} placeholder="email@domain.com" required />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Username <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="uname" value={formData.uname} onChange={handleChange} placeholder="username akun" required/>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Password <span className="text-danger">*</span></label>
                <input type="password" className="form-control form-control-sm" name="passwd" value={formData.passwd} onChange={handleChange} placeholder="minimal 6 karakter" required/>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Role <span className="text-danger">*</span></label>
                <select className="form-select form-select-sm" name="role" value={formData.role} onChange={handleChange} required>
                  <option value="pembeli">Pembeli</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Alamat</label>
                <textarea className="form-control form-control-sm" rows="2" name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Alamat lengkap pembeli..."></textarea>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Foto Profil (Opsional)</label>
                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange}/>
              </div>

              {preview && (
                <div className="col-12">
                  <p className="form-label fw-semibold text-dark small mb-1">Preview Foto:</p>
                  <div className="border rounded p-1 d-inline-block" style={{ backgroundColor: '#FAF0E6', borderColor: '#E8D3C5' }}>
                    <img src={preview} alt="Preview Foto" className="rounded-circle"style={{ width: '80px', height: '80px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
                  </div>
                </div>
              )}

              <div className="col-12 d-flex gap-2 pt-2">
                <button type="submit" className="btn btn-sm px-4 fw-semibold text-white border-0 rounded-3 shadow-sm" style={{ backgroundColor: '#D8838B' }} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan Pembeli'}</button>
                <Link to="/admin/pembeli" className="btn btn-light border btn-sm px-3">Batal</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}