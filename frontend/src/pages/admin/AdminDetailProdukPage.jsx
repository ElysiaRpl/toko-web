// src/pages/admin/AdminDetailProdukPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getToken, mediaUrl, formatRupiah, onImgError } from '../../utils';

export default function AdminDetailProdukPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

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
          throw new Error(result.message || 'Gagal memuat detail produk');
        }

        setProduk(result.data || result);
      } catch (err) {
        console.error('Error:', err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailProduk();
  }, [id]);

  if (loading) {
    return <div className="p-4 text-center text-muted">Memuat detail produk...</div>;
  }

  if (errorMsg) {
    return (
      <div className="container-fluid p-0">
        <div className="alert alert-danger py-2 px-3 small" role="alert">
          {errorMsg}
        </div>
        <Link to="/admin/produk" className="btn btn-sm px-3 py-1 rounded-3 fw-semibold" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>Kembali ke Daftar Produk</Link>
      </div>
    );
  }

  if (!produk) {
    return <div className="p-4 text-center">Produk tidak ditemukan.</div>;
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Detail Produk #{id}</p>
            <p className="text-muted small mb-0">Informasi lengkap mengenai produk.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to={`/admin/produk/edit/${id}`} className="btn btn-sm px-3 text-white fw-semibold" style={{backgroundColor: '#D8838B'}}><i className="bi bi-pencil-square me-1"></i> Edit</Link>
            <Link to="/admin/produk" className="btn btn-outline-secondary btn-sm px-3">Kembali</Link>
          </div>
        </div>

        <div className="card border-0 shadow-sm bg-white p-4">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-md-4 text-center">
              <div className="border rounded-3 p-2 d-inline-block w-100" style={{ backgroundColor: '#FAF0E6', borderColor: '#8D7B68' }}>
                <img src={mediaUrl(produk.gambar)} alt={produk.nama_produk} className="rounded object-fit-cover w-100" style={{ maxHeight: '250px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
              </div>
            </div>

            <div className="col-12 col-md-8">
              <p className="fw-bold mb-2 fs-4" style={{ color: '#2A1E17', fontFamily: 'serif' }}>{produk.nama_produk}</p>
              
              <div className="mb-3">
                <span className="border rounded-2 px-3 py-1 fw-medium" style={{ backgroundColor: '#FAF0E6', color: '#8D7B68', borderColor: '#8D7B68', fontSize: '13px' }}>{produk.kategori || 'Tanpa Kategori'}</span>
              </div>

              <p className="fw-bold mb-4 fs-3" style={{ color: '#D8838B' }}>{formatRupiah(produk.harga)}</p>

              <hr className="text-muted opacity-25 my-3" />

              <p className="fw-bold mb-4 fs-3" style={{ color: '#D8838B' }}>{formatRupiah(produk.harga)}</p>
              <p className="text-muted" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '14px' }}>{produk.deskripsi || 'Tidak ada deskripsi yang ditambahkan untuk produk ini.'}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}