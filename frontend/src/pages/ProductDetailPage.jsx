// frontend/src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { formatRupiah, mediaUrl, onImgError } from '../utils';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [metodeBayar, setMetodeBayar] = useState('COD');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.getProdukById(id);
        setProduk(res.data);
      } catch (err) {
        console.error('Error fetch produk:', err);
        if (err.status === 404) {
          setError('Produk tidak ditemukan');
        } else {
          setError(err.message || 'Gagal memuat detail produk');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
  }, [id]);

  const handleBeli = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/produk/${id}` } });
      return;
    }

    if (user?.role !== 'pembeli') {
      alert('Hanya pembeli yang bisa melakukan pembelian');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        id_produk: parseInt(id),
        metode_pembayaran: metodeBayar,
        catatan: catatan || undefined,
      };

      await api.createPembelian(payload);
      alert('Pembelian berhasil!');
      navigate('/akun/pesanan');
    } catch (err) {
      console.error('Error pembelian:', err);
      alert(err.message || 'Gagal melakukan pembelian');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#D8838B' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary">Memuat detail produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center py-5" role="alert">
        <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2"></i>
        {error}
        <div className="mt-3">
          <Link to="/toko" className="btn btn-sm rounded-3" style={{ color: '#5C4033', borderColor: '#5C4033' }}>Kembali ke toko</Link>
        </div>
      </div>
    );
  }

  if (!produk) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-box fs-1 d-block mb-3 text-secondary"></i>
        <h5 className="text-secondary">Produk tidak ditemukan</h5>
        <Link to="/toko" className="btn btn-sm mt-3 rounded-3" style={{ color: '#5C4033', borderColor: '#5C4033' }}>Kembali ke Toko</Link>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav className="mb-4" style={{ '--bs-breadcrumb-divider': "'>'" }}>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none" style={{ color: '#D8838B' }}>Beranda</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/toko" className="text-decoration-none" style={{ color: '#D8838B' }}>Toko</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {produk.nama_produk}
            </li>
          </ol>
        </nav>

        {/* Detail Produk */}
        <div className="row g-4">
          {/* Gambar */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
              <img src={mediaUrl(produk.gambar)} alt={produk.nama_produk} className="img-fluid" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
            </div>
          </div>

          {/* Info Produk */}
          <div className="col-md-6">
            <div className="card border-0 shadow-sm rounded-3 p-4">
              <span className="badge mb-2 align-self-start px-3 py-2" style={{ backgroundColor: '#FAF0E6', color: '#D8838B' }}>
                {produk.kategori}
              </span>
              <p className="display-6 fw-bold" style={{ color: '#2A1E17', fontFamily: 'serif' }}>{produk.nama_produk}</p>
              <p className="fw-bold fs-3" style={{ color: '#D8838B' }}>{formatRupiah(produk.harga)}</p>
              <hr />

              <p className="fw-bold" style={{ color: '#2A1E17' }}>Deskripsi</p>
              <p className="text-secondary" style={{ whiteSpace: 'pre-line' }}>{produk.deskripsi}</p>

              <hr />

              {/* Form Pembelian / Peringatan Login */}
              {isLoggedIn && user?.role === 'pembeli' ? (
                <form onSubmit={handleBeli}>
                  <div className="mb-3">
                    <label htmlFor='MetodePembayaran' className="form-label fw-bold">Metode Pembayaran</label>
                    <select className="form-select" value={metodeBayar} onChange={(e) => setMetodeBayar(e.target.value)} required>
                      <option value="COD">COD (Bayar di Tempat)</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor='Catatan' className="form-label fw-bold">Catatan (Opsional)</label>
                    <textarea className="form-control" rows="2" placeholder="Tambahkan catatan untuk pembelian..." value={catatan} onChange={(e) => setCatatan(e.target.value)}/>
                  </div>

                  <button type="submit" className="btn text-white w-100 fw-bold py-2 rounded-3 shadow-sm border-0" disabled={submitting} style={{ backgroundColor: '#D8838B' }}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus me-2"></i>
                        Beli Sekarang
                      </>
                    )}
                  </button>
                </form>
              ) : isLoggedIn && user?.role === 'admin' ? (
                <div className="alert alert-info mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Anda login sebagai admin. Untuk membeli, gunakan akun pembeli.
                </div>
              ) : (
                <div className="alert alert-warning mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>Silakan <Link to="/login" state={{ from: `/produk/${id}` }} className="fw-bold" style={{ color: '#5C4033' }}>login</Link> terlebih dahulu untuk membeli produk.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-4">
          <Link to="/toko" className="btn rounded-3 fw-semibold" style={{ color: '#5C4033', borderColor: '#5C4033' }}><i className="bi bi-arrow-left me-2"></i>Lihat produk lain</Link>
        </div>
      </div>
    </>
  );
}