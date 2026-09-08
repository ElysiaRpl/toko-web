// frontend/src/pages/TokoPage.jsx
import { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import CardProduk from '../components/common/ProdukCard';

export default function TokoPage() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kategoriActive, setKategoriActive] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Ambil data produk dari API
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        setLoading(true);
        const res = await api.getProduk();
        setProduk(res.data || []);
        setError('');
      } catch (err) {
        console.error('Error fetch produk:', err);
        setError(err.message || 'Gagal memuat data produk');
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
  }, []);

  // 2. Buat list kategori OTOMATIS dari data produk di database
  const kategoriList = useMemo(() => {
    const daftarKategoriUnik = Array.from(
      new Set(produk.map((p) => p.kategori).filter(Boolean))
    );
    return ['Semua', ...daftarKategoriUnik];
  }, [produk]);

  // 3. Filter produk berdasarkan kategori & pencarian
  const filteredProduk = useMemo(() => {
    let result = produk;

    if (kategoriActive !== 'Semua') {
      result = result.filter((p) => p.kategori === kategoriActive);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((p) =>
        (p.nama_produk || p.nama)?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [produk, kategoriActive, searchQuery]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#D8838B' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary">Memuat produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center py-5" role="alert">
        <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2"></i>
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="container ">
        {/* Title & Description */}
        <div className="row mb-4">
          <div className="col-12">
            <p className="fw-bold display-6 mb-1 mt-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Koleksi Ellystitch</p>
            <p style={{ color: '#8D7B68' }}>Temukan berbagai produk rajutan handmade estetik dan berkualitas buatan tangan</p>
          </div>
        </div>

        {/* Filter Kategori */}
        <div className="row mb-4">
          <div className="col-12 d-flex flex-wrap gap-2">
            {kategoriList.map((kategori) => (
              <button key={kategori}className="btn btn-sm px-3 py-2 fw-semibold" style={{ backgroundColor: kategoriActive === kategori ? '#D8838B' : 'transparent', color: kategoriActive === kategori ? '#ffffff' : '#5C4033', border: `1px solid ${kategoriActive === kategori ? '#D8838B' : '#5C4033'}`, borderRadius: '8px'}} onClick={() => setKategoriActive(kategori)}>{kategori}</button>
            ))}
          </div>
        </div>

        {/* Grid List Produk */}
        {filteredProduk.length === 0 ? (
          <p className="text-center text-muted my-5">Produk tidak ditemukan.</p>
        ) : (
          <div className="row g-4 mb-5">
            {filteredProduk.map((item) => (
              <div
                key={item.id_produk || item.id}
                className="col-lg-4 col-md-6 col-12 d-flex align-items-stretch"
              >
                <CardProduk item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}