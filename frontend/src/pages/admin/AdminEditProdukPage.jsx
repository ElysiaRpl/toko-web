// src/pages/admin/AdminEditProdukPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getToken } from '../../utils';

export default function AdminEditProdukPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nama_produk: '',
    kategori: '',
    harga: '',
    deskripsi: '',
  });

  const [gambarBaru, setGambarBaru] = useState(null);
  const [preview, setPreview] = useState(null); 

  useEffect(() => {
    const fetchDetailProduk = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/produk/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Gagal memuat data produk');
        }

        const produk = result.data || result;

        setFormData({
          nama_produk: produk.nama_produk || produk.nama || '',
          kategori: produk.kategori || '',
          harga: produk.harga || '',
          deskripsi: produk.deskripsi || '',
        });

        if (produk.gambar) {
          const imageUrl = produk.gambar.startsWith('http') 
            ? produk.gambar 
            : `http://localhost:5000${produk.gambar}`;
          setPreview(imageUrl);
        }
      } catch (err) {
        console.error('Error:', err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailProduk();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarBaru(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setSubmitting(true);
      const token = getToken();

      const dataPayload = new FormData();
      dataPayload.append('nama_produk', formData.nama_produk);
      dataPayload.append('kategori', formData.kategori);
      dataPayload.append('harga', formData.harga);
      dataPayload.append('deskripsi', formData.deskripsi);

      if (gambarBaru) {
        dataPayload.append('gambar', gambarBaru);
      }

      const response = await fetch(`http://localhost:5000/api/admin/produk/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataPayload,
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Gagal memperbarui produk');
      }

      navigate('/admin/produk');
    } catch (err) {
      console.error('Gagal update produk:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan pada server');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-muted">Memuat data produk...</div>;
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Edit Produk #{id}</p>
            <p className="text-muted small mb-0">Ubah informasi produk di bawah ini.</p>
          </div>
          <Link to="/admin/produk" className="btn btn-sm px-3 py-1 rounded-3 fw-semibold" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>Kembali</Link>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="card border-0 shadow-sm bg-white p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-8">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nama Produk <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="nama_produk" value={formData.nama_produk} onChange={handleChange}required/>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Harga (Rp) <span className="text-danger">*</span></label>
                <input type="number" className="form-control form-control-sm" name="harga" value={formData.harga} onChange={handleChange} min="0" required />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Kategori</label>
                <input type="text" className="form-control form-control-sm" name="kategori" value={formData.kategori} onChange={handleChange}/>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Ganti Gambar (Opsional)</label>
                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange}/>
                <small className="text-muted" style={{ fontSize: '11px' }}>Biarkan kosong jika tidak ingin mengubah gambar.</small>
              </div>

              <div className="col-12">
                <p className="form-label fw-semibold small mb-1" style={{ color: '#2A1E17' }}>Preview Gambar:</p>
                <div className="border rounded p-1 d-inline-block bg-light">
                  {preview ? (
                    <img src={preview} alt="Preview" className="rounded" style={{ width: '120px', height: '90px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}/>
                  ) : (
                    <div className="text-muted small p-3">Tidak ada gambar</div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Deskripsi Produk</label>
                <textarea className="form-control form-control-sm" rows="4" name="deskripsi" value={formData.deskripsi} onChange={handleChange}></textarea>
              </div>

              <div className="col-12 d-flex gap-2 pt-2">
                <button type="submit" className="btn text-white btn-sm px-4 fw-semibold rounded-3 border-0" style={{ backgroundColor: '#D8838B' }} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                <Link to="/admin/produk" className="btn btn-sm px-3 rounded-3" style={{ color: '#2A1E17', backgroundColor: '#FAF0E6', border: '1px solid #8D7B68' }}>Batal</Link>              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}