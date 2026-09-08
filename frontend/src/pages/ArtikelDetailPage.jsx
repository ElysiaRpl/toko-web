// frontend/src/pages/ArtikelDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import { mediaUrl, onImgError, formatTanggal } from '../utils';

export default function ArtikelDetailPage() {
  const { id } = useParams();
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.getArtikelById(id);
        setArtikel(res.data);
      } catch (err) {
        console.error('Error fetch artikel:', err);
        if (err.status === 404) {
          setError('Artikel tidak ditemukan');
        } else {
          setError(err.message || 'Gagal memuat detail artikel');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchArtikel();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#D8838B' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary">Memuat artikel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center py-5" role="alert">
        <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2"></i>
        {error}
        <div className="mt-3">
          <Link to="/artikel" className="btn btn-sm rounded-3" style={{ color: '#5C4033', borderColor: '#5C4033' }}>Kembali ke Artikel</Link>
        </div>
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-file-earmark-text fs-1 d-block mb-3 text-secondary"></i>
        <p className="text-secondary fs-3">Artikel tidak ditemukan</p>
        <Link to="/artikel" className="btn btn-sm mt-3 rounded-3" style={{ color: '#5C4033', borderColor: '#5C4033' }}>Kembali ke Artikel</Link>
      </div>
    );
  }

  return (
    <>
      <div>
        <nav className="m-5" style={{ '--bs-breadcrumb-divider': "'>'" }}>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none" style={{ color: '#D8838B' }}>Beranda</Link>
            </li>
            <li className="breadcrumb-item">
             <Link to="/artikel" className="text-decoration-none" style={{ color: '#D8838B' }}>Artikel</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">{artikel.judul}</li>
          </ol>
        </nav>

        <article className='m-5'>
          <div className="mb-4">
            <p className="display-5 fw-bold" style={{ color: '#2A1E17', fontFamily: 'serif' }}>{artikel.judul}</p>
            <div className="d-flex gap-3 text-muted small mt-2">
              <span><i className="bi bi-calendar3 me-1"></i>{formatTanggal(artikel.created_at)}</span>
            </div>
          </div>

          {artikel.gambar && (
            <div className="mb-4">
              <img src={mediaUrl(artikel.gambar)} alt={artikel.judul} className="img-fluid rounded-3 shadow-sm" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
            </div>
          )}

          {artikel.ringkasan && (
            <div className="p-4 rounded-3 mb-4 border-start border-4" style={{ backgroundColor: '#FAF0E6', borderColor: '#D8838B' }}>
              <p className="fs-5 fst-italic mb-0" style={{ color: '#8D7B68' }}>{artikel.ringkasan}</p>
            </div>
          )}

          <div  className="artikel-content" style={{  whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '1.05rem', color: '#2A1E17'}}>{artikel.isi}</div>

          <div className="mt-5 pt-3 border-top">
            <Link to="/artikel" className="btn rounded-3 fw-semibold" style={{ color: '#5C4033', borderColor: '#5C4033' }}><i className="bi bi-arrow-left me-2"></i>Kembali ke Daftar Artikel</Link>
          </div>
        </article>
      </div>
    </>
  );
}