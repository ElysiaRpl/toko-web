// frontend/src/pages/admin/AdminProdukPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../api"; // ← Pakai API yang sudah dibuat

export default function AdminProdukPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetching Data Produk dari API (pakai adminApi)
  const loadProduk = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await adminApi.getProduk(); // ← Pakai adminApi
      console.log("Response produk:", res); // Debug
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Gagal memuat produk:", err);
      setError(err.message || "Gagal memuat data produk");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduk();
  }, []);

  // Format Mata Uang Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number || 0);
  };

  // Helper untuk URL gambar
  const getImageUrl = (gambar) => {
    if (!gambar) return "/placeholder-image.jpg";
    if (gambar.startsWith("http")) return gambar;
    return `http://localhost:5000/uploads/images/${gambar}`;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#D8838B' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted small">Memuat data produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center py-4" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
        <button className="btn btn-outline-danger btn-sm ms-3" onClick={loadProduk}>
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="fw-bold mb-1 fs-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Daftar produk</p>
            <p className="text-muted small mb-0">{items.length} produk</p>
          </div>
          <Link to="/admin/produk/tambah" className="btn btn-sm px-3 py-2 fw-semibold text-white border-0 rounded-3 shadow-sm" style={{ backgroundColor: '#D8838B' }}>+ Produk baru</Link>
        </div>

        {items.length === 0 ? (
          <div className="card border-0 shadow-sm p-4 text-center">
            <i className="bi bi-box-seam fs-1 d-block mb-3 text-secondary"></i>
            <p className="text-muted mb-0">Belum ada produk di katalog.</p>
            <Link to="/admin/produk/tambah" className="btn btn-sm mt-3 fw-semibold text-white border-0 rounded-3" style={{ backgroundColor: '#D8838B' }}>Tambah produk pertama</Link>
          </div>
        ) : (
          <div className="card border-0 shadow-sm bg-white overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: "14px" }}>
                <thead className="text-uppercase" style={{ fontSize: "12px", letterSpacing: "0.5px", backgroundColor: '#FAF0E6', color: '#2A1E17' }}>
                  <tr>
                    <th className="py-3 px-3" style={{ width: "80px" }}>GAMBAR</th>
                    <th className="py-3">NAMA</th>
                    <th className="py-3">KATEGORI</th>
                    <th className="py-3">HARGA</th>
                    <th className="py-3 text-center" style={{ width: "200px" }}>TINDAKAN</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id_produk || p.id}>
                      <td className="px-3">
                        <img src={getImageUrl(p.gambar)} alt={p.nama_produk || p.nama} className="rounded border" width={60} height={45} style={{ objectFit: "cover", backgroundColor: "#f8f9fa" }} onError={(e) => {e.currentTarget.src = "/placeholder-image.jpg";}}/>
                      </td>

                      <td className="fw-bold" style={{ color: '#2A1E17' }}>{p.nama_produk || p.nama}</td>

                      <td className="text-muted">{p.kategori || "-"}</td>

                      <td className="fw-semibold" style={{ color: '#2A1E17' }}>{formatRupiah(p.harga)}</td>

                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <Link to={`/admin/produk/detail/${p.id_produk || p.id}`} className="btn btn-sm px-2 py-1 rounded-3 fw-semibold" style={{ fontSize: "12px", color: '#8D7B68', borderColor: '#8D7B68' }}>Detail</Link>
                          <Link to={`/admin/produk/edit/${p.id_produk || p.id}`} className="btn btn-sm px-2 py-1 rounded-3 fw-semibold" style={{ fontSize: "12px", color: '#8D7B68', borderColor: '#8D7B68' }}>Ubah</Link>
                          <Link to={`/admin/produk/hapus/${p.id_produk || p.id}`} className="btn btn-outline-danger btn-sm px-2 py-1 rounded-1" style={{ fontSize: "12px" }}>Hapus</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}