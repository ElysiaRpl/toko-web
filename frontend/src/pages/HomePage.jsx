import { Link } from 'react-router-dom';
import { useBerandaData } from '../hooks';
import { SITE, CATEGORIES } from '../constants';
import CardProduk from '../components/common/ProdukCard';
import CardArtikel from '../components/common/ArtikelCard';

export default function HomePage() {
  const { loading, error, produkTerbaru, artikelTampil } = useBerandaData();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#E2959B' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary">Memuat data toko...</p>
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
      {/* ==================== HERO / BANNER ==================== */}
      <section className="rounded-4 overflow-hidden my-3" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="container-fluid px-5">
          {/* align-items-center memastikan layout menyamping tetap sejajar & rapi */}
          <div className="row align-items-center">
            
            {/* Kolom Kiri - Teks & Tombol */}
            <div className="col-md-6 py-5 pe-md-4">
              <span className="badge rounded-pill px-3 py-2 text-uppercase mb-3" style={{ backgroundColor: '#FAF0E6', color: '#D8838B', letterSpacing: '1px', fontSize: '0.8rem' }}>
                Koleksi Terbaru — 2026
              </span>
              <h1 className="fw-bold mb-3 display-4" style={{ color: '#2A1E17', fontFamily: 'serif' }}>
                Handmade Pieces, <span style={{ color: '#D8838B', fontStyle: 'italic' }}>Made With Love</span>
              </h1>
              <p className="fs-5 mb-4 pe-md-4" style={{ color: '#8D7B68', lineHeight: '1.6' }}>
                {SITE.tentang || "Temukan karya crochet handmade yang dibuat dengan ketelitian, kreativitas, dan penuh perhatian."}
              </p>
              <div className="d-flex align-items-center gap-3">
                <Link 
                  to="/toko" 
                  className="btn text-white px-4 py-3 rounded-3 fw-semibold shadow-sm border-0" 
                  style={{ backgroundColor: '#D8838B' }}
                >
                  BELANJA SEKARANG
                </Link>
                <Link 
                  to="/artikel" 
                  className="btn px-4 py-3 rounded-3 fw-semibold border" 
                  style={{ color: '#5C4033', borderColor: '#5C4033', backgroundColor: 'transparent' }}
                >
                  BACA ARTIKEL
                </Link>
              </div>
            </div>

            {/* Kolom Kanan - Gambar Layout Menyamping */}
            <div className="col-md-6 py-5 text-center">
              <div className="position-relative d-inline-block">
                <img 
                  src={SITE.foto_banner} 
                  alt="banner" 
                  className="img-fluid rounded-4 shadow" 
                  style={{ maxHeight: '420px', width: '100%', objectFit: 'cover' }} 
                  onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== KATEGORI ==================== */}
      <section className="py-5" style={{ backgroundColor: '#F8F6F0' }}>
        <div className="container-fluid px-5">
          <div className="text-center mb-5">
            <p className="text-uppercase fw-bold mb-1 small" style={{ color: '#D8838B', letterSpacing: '2px' }}>Dunia Kami</p>
            <h2 className="fw-bold fs-2" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Belanja Berdasarkan Kategori</h2>
          </div>

          <div className="row g-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.id} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                  <img src={cat.foto} className="card-img-top" alt={cat.nama} style={{ height: '220px', objectFit: 'cover' }}/>
                  <div className="card-body p-4 d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="card-title fw-bold mb-2" style={{ color: '#2A1E17' }}>{cat.nama}</h5>
                      <p className="card-text text-muted small">{cat.deskripsi}</p>
                      <span className="badge bg-light text-dark border me-2">{cat.totalproduk} Produk</span>
                    </div>
                    <Link to={`/toko?kategori=${cat.id}`} className="text-decoration-none fw-bold mt-4 d-inline-block small" style={{ color: '#D8838B' }}>
                      LIHAT PRODUK &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#F7F5F0' }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p className="fw-bold fs-2 mb-0" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Produk Terbaru</p>
              <p className="fs-6 mt-0" style={{ color: '#dcd3b6' }}> Produk-produk pilihan terbaru dari kami</p>
            </div>
          </div>

          <div className="row g-4 pb-4">
            {produkTerbaru.length === 0 ? (
              <div className="text-center py-4 text-secondary">
                <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                Belum ada produk tersedia
              </div>
            ) : (
                produkTerbaru.slice(0, 4).map((produk) => (
                <div className="col-md-3 col-6" key={produk.id_produk || produk.id}><CardProduk item={produk} /></div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ==================== ABOUT / BRAND STORY ==================== */}
      <section className="py-5" style={{ backgroundColor: '#5C4033', color: '#FAF6F0' }}>
        <div className="container-fluid px-5">
          <div className="row align-items-center py-4">
            <div className="col-md-12 ps-md-5 text-center">
              <p className="text-uppercase fw-bold mb-1 small" style={{ color: '#E2959B', letterSpacing: '2px' }}>Cerita Kami</p>
              <p className="display-6 fw-bold mb-3" style={{ fontFamily: 'serif' }}>Dibuat Perlahan, Dibuat Penuh Makna.</p>
              <p className="text-light opacity-75 mb-4" style={{ lineHeight: '1.8' }}>{SITE.nama_toko} lahir dari kecintaan terhadap kerajinan tangan. Setiap produk dimulai dari pemilihan benang yang cermat, dan jam-jam pengerjaan yang penuh kesabaran.</p>
              <Link to="/artikel" className="btn btn-outline-light px-4 py-2 rounded-3 text-decoration-none fw-semibold">
                BACA ARTIKEL KAMI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ARTIKEL TERBARU ==================== */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container-fluid px-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <p className="text-uppercase fw-bold mb-1 small" style={{ color: '#D8838B', letterSpacing: '2px' }}>Jurnal & Tips</p>
              <h2 className="fs-2 fw-bold m-0" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Artikel Terbaru</h2>
            </div>
            <Link to="/artikel" className="text-decoration-none fw-bold small" style={{ color: '#5C4033' }}>
              SEMUA ARTIKEL &rarr;
            </Link>
          </div>

          <div className="row g-4">
            {artikelTampil.length === 0 ? (
              <div className="text-center py-4 text-secondary">
                <i className="bi bi-file-earmark-text fs-1 d-block mb-2"></i>
                Belum ada artikel tersedia
              </div>
            ) : (
              artikelTampil.slice(0, 3).map((artikel) => (
                <div className="col-md-4" key={artikel.id}>
                  <CardArtikel artikel={artikel} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}