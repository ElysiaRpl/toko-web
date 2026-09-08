// frontend/src/pages/admin/AdminEditArtikelPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { getToken, mediaUrl, onImgError } from '../../utils';

export default function AdminEditArtikelPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    judul: '',
    ringkasan: '',
    isi: '',
  });

  const [gambarFile, setGambarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentGambar, setCurrentGambar] = useState(null);

  // Ambil data artikel
  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getArtikelById(id);
        const data = res.data || res;

        setFormData({
          judul: data.judul || '',
          ringkasan: data.ringkasan || '',
          isi: data.isi || '',
        });

        if (data.gambar) {
          setCurrentGambar(data.gambar);
          setPreview(mediaUrl(data.gambar));
        }
      } catch (err) {
        console.error('Error fetching artikel:', err);
        setErrorMsg(err.message || 'Gagal memuat data artikel');
      } finally {
        setLoading(false);
      }
    };

    fetchArtikel();
  }, [id]);

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

    try {
      setSubmitting(true);
      const token = getToken();

      const dataPayload = new FormData();
      dataPayload.append('judul', formData.judul);
      dataPayload.append('ringkasan', formData.ringkasan);
      dataPayload.append('isi', formData.isi);

      // Hanya kirim gambar jika ada file baru
      if (gambarFile) {
        dataPayload.append('gambar', gambarFile);
      }

      console.log('📤 Mengirim update artikel:', [...dataPayload.entries()]);

      const response = await fetch(`http://localhost:5000/api/admin/artikel/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataPayload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal memperbarui artikel');
      }

      navigate('/admin/artikel');
    } catch (err) {
      console.error('Error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan pada server');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-muted">Memuat data artikel...</div>;
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1 fs-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Edit Artikel #{id}</p>
            <p className="text-muted small mb-0">Ubah informasi artikel di bawah ini.</p>
          </div>
          <Link to="/admin/artikel" className="btn btn-sm px-3 py-1 rounded-3 fw-semibold" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>Kembali</Link>
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
                <input type="text" className="form-control form-control-sm" name="judul" value={formData.judul} onChange={handleChange} required/>
              </div> 

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Ringkasan <span className="text-danger">*</span></label>
                <textarea className="form-control form-control-sm" rows="3" name="ringkasan" value={formData.ringkasan} onChange={handleChange} required/>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Isi Artikel <span className="text-danger">*</span></label>
                <textarea className="form-control form-control-sm" rows="8" name="isi" value={formData.isi} onChange={handleChange} required/>
                <small className="text-muted" style={{ fontSize: '11px' }}>Gunakan paragraf untuk memisahkan konten.</small>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Ganti Gambar (Opsional)</label>
                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange}/>
                <small className="text-muted" style={{ fontSize: '11px' }}>Biarkan kosong jika tidak ingin mengubah gambar.</small>
              </div>

              <div className="col-12">
                <p className="form-label fw-semibold small mb-1" style={{ color: '#2A1E17' }}>Preview Gambar:</p>
                <div className="border rounded-3 p-2 d-inline-block" style={{ backgroundColor: '#FAF0E6', borderColor: '#8D7B68' }}>
                  {preview ? (
                    <img src={preview} alt="Preview" className="rounded" style={{ width: '200px', height: '120px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
                  ) : (
                    <div className="text-muted small p-3">Tidak ada gambar</div>
                  )}
                </div>
              </div>

              <div className="col-12 d-flex gap-2 pt-2">
                <button type="submit" className="btn text-white btn-sm px-4 fw-semibold rounded-3 border-0" style={{ backgroundColor: '#D8838B' }} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                <Link to="/admin/artikel" className="btn btn-sm px-3 rounded-3" style={{ color: '#2A1E17', backgroundColor: '#FAF0E6', border: '1px solid #8D7B68' }}>Batal</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}