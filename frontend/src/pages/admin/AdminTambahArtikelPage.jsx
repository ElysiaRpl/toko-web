// frontend/src/pages/admin/AdminTambahArtikelPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken } from '../../utils';

export default function AdminTambahArtikelPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    judul: '',
    ringkasan: '',
    isi: '',
  });

  const [gambarFile, setGambarFile] = useState(null);
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
      setGambarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg('');

  if (!formData.judul || !formData.ringkasan || !formData.isi) {
    setErrorMsg('Judul, ringkasan, dan isi wajib diisi!');
    return;
  }

  if (!gambarFile) {
    setErrorMsg('Gambar wajib dipilih!');
    return;
  }

  try {
    setSubmitting(true);
    const token = getToken();

    const dataPayload = new FormData();
    dataPayload.append('judul', formData.judul);
    dataPayload.append('ringkasan', formData.ringkasan);
    dataPayload.append('isi', formData.isi);
    dataPayload.append('gambar', gambarFile);

    console.log("📤 Mengirim data:");
    for (let [key, value] of dataPayload.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name}`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    const response = await fetch('http://localhost:5000/api/admin/artikel', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: dataPayload,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Gagal menambahkan artikel');
    }

    navigate('/admin/artikel');
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
            <p className="fw-bold mb-1 fs-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Tambah Artikel Baru</p>
            <p className="text-muted small mb-0">Isi formulir di bawah untuk menambahkan artikel baru.</p>
          </div>
          <Link to="/admin/artikel" className="btn btn-sm px-3 py-1 fw-semibold rounded-3" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>Kembali</Link>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="card border-0 shadow-sm bg-white p-4 rounded-3">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Judul <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="judul" value={formData.judul} onChange={handleChange} placeholder="Masukkan judul artikel..." required/>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Ringkasan <span className="text-danger">*</span></label>
                <textarea className="form-control form-control-sm" rows="3" name="ringkasan" value={formData.ringkasan} onChange={handleChange} placeholder="Tuliskan ringkasan singkat artikel..." required/>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Isi Artikel <span className="text-danger">*</span></label>
                <textarea className="form-control form-control-sm" rows="8" name="isi" value={formData.isi} onChange={handleChange} placeholder="Tuliskan isi artikel lengkap di sini..." required/>
                <small className="text-muted" style={{ fontSize: '11px' }}>Gunakan paragraf untuk memisahkan konten.</small>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Gambar <span className="text-danger">*</span></label>
                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange} required/>
                <small className="text-muted" style={{ fontSize: '11px' }}>Format: jpg, jpeg, png, gif, webp (maks 5MB)</small>
              </div>

              {preview && (
                <div className="col-12">
                  <p className="form-label fw-semibold small mb-1" style={{ color: '#2A1E17' }}>Preview Gambar:</p>
                  <div className="border rounded p-1 d-inline-block" style={{ backgroundColor: '#FAF0E6', borderColor: '#E8D3C5' }}>
                    <img src={preview} alt="Preview" className="rounded" style={{ width: '200px', height: '120px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
                  </div>
                </div>
              )}

              <div className="col-12 d-flex gap-2 pt-2">
                <button type="submit" className="btn btn-sm px-4 fw-semibold text-white border-0 rounded-3 shadow-sm" style={{ backgroundColor: '#D8838B' }} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan Artikel'}</button>
                <Link to="/admin/artikel" className="btn btn-light border btn-sm px-3">Batal</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}