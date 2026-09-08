// frontend/src/pages/ArtikelListPage.jsx
import { useState, useEffect } from 'react';
import { api } from '../api';
import CardArtikel from '../components/common/ArtikelCard';

export default function ArtikelListPage() {
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Ambil data artikel dari API
  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        setLoading(true);
        const res = await api.getArtikel();
        setArtikel(res.data || []);
        setError('');
      } catch (err) {
        console.error('Error fetch artikel:', err);
        setError(err.message || 'Gagal memuat data artikel');
      } finally {
        setLoading(false);
      }
    };
    fetchArtikel();
  }, []);

  // Filter artikel berdasarkan search
  const filteredArtikel = artikel.filter((item) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      item.judul?.toLowerCase().includes(query) ||
      item.ringkasan?.toLowerCase().includes(query)
    );
  });

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="alert alert-danger text-center py-5" role="alert">
        <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2"></i>
        {error}
      </div>
    );
  }

  return (
    <div className='container-fluid'>
      <div className='row ms-5 '>
        <div className="mt-3 mb-0">
          <p className="fw-bold display-6 mb-0" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Artikel & Jurnal Ellystitch</p>
          <p style={{ color: '#8D7B68' }} className="mt-0">Temukan panduan perawatan rajutan, inspirasi gaya, dan cerita di balik karya handmade kami</p>
        </div>

        <p className="small" style={{ color: '#8D7B68' }}> Menampilkan {filteredArtikel.length} artikel{searchQuery && ` untuk pencarian "${searchQuery}"`}</p>

        {filteredArtikel.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-file-earmark-text fs-1 d-block mb-3 text-secondary"></i>
            <p className="text-secondary fs-5">Belum ada artikel tersedia</p>
          </div>
        ) : (
          <div className="row g-4 mt-3 mb-5">
            {filteredArtikel.map((item) => (
              <div className="col-md-6 col-lg-4 d-flex align-items-stretch" key={item.id || item.id_artikel}>
                <CardArtikel
                  artikel={{
                    id: item.id,
                    judul: item.judul,
                    ringkasan: item.ringkasan,
                    foto: item.gambar,
                    tanggal: new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }),
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}