// frontend/src/pages/pembeli/PembeliOverviewPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pembeliApi } from '../../api';
import { formatRupiah, formatTanggal, mediaUrl, onImgError } from '../../utils';

export default function PembeliOverviewPage() {
  const [stats, setStats] = useState({
    total_pembelian: 0,
    selesai: 0,
    diterima: 0,
    dikirim: 0,
    dikemas: 0,
    tertunda: 0,
    pesanan_aktif: 0,
    dibayar: 0,
    belum_bayar: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalBelanja, setTotalBelanja] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await pembeliApi.getDashboard();
        
        const statsData = res.data.stats || {};
        
        // Hitung pesanan aktif (angka)
        const hitungPesananAktif = 
          Number(statsData.tertunda || 0) +
          Number(statsData.dikemas || 0) +
          Number(statsData.dikirim || 0) +
          Number(statsData.diterima || 0);

        setStats({
          total_pembelian: Number(statsData.total_pembelian || 0),
          selesai: Number(statsData.selesai || 0),
          diterima: Number(statsData.diterima || 0),
          dikirim: Number(statsData.dikirim || 0),
          dikemas: Number(statsData.dikemas || 0),
          tertunda: Number(statsData.tertunda || 0),
          pesanan_aktif: hitungPesananAktif,
          dibayar: Number(statsData.dibayar || 0),
          belum_bayar: Number(statsData.belum_bayar || 0),
        });

        const orders = res.data.recent_pembelian || [];
        setRecentOrders(orders);

        // Hitung total belanja (dibayar)
        const total = orders
          .filter(o => o.pembayaran === 'Dibayar')
          .reduce((sum, o) => sum + Number(o.produk_harga || 0), 0);
        setTotalBelanja(total);

      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.message || 'Gagal memuat dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#D8838B' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary">Memuat dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center py-5" role="alert">
        {error}
      </div>
    );
  }

  return (
    <>
    <div className="container-fluid p-0">
      <div className="mb-4">
        <p className="fw-bold fs-3 mb-1" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Dashboard</p>
        <p className="text-muted small">Selamat datang di akun Anda!</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 text-center">
            <p className="text-muted small mb-0">Total Pesanan</p>
            <h3 className="fw-bold mb-0" style={{ color: '#D8838B' }}>{formatRupiah(totalBelanja)}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 text-center">
            <p className="text-muted small mb-0">Pesanan Aktif</p>
            <h3 className="fw-bold text-warning mb-0">{stats.pesanan_aktif}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 text-center">
            <p className="text-muted small mb-0">Belum Dibayar</p>
            <h3 className="fw-bold text-danger mb-0">{stats.belum_bayar}</h3>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm p-3 text-center">
            <p className="text-muted small mb-0">Selesai</p>
            <h3 className="fw-bold text-success mb-0">{stats.selesai}</h3>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="fw-bold text-dark mb-1">Total Belanja (Dibayar)</p>
            <p className="text-muted small mb-0">Akumulasi harga produk pada pesanan berstatus pembayaran "Dibayar".</p>
          </div>
          <h3 className="fw-bold text-warning mb-0">{formatRupiah(totalBelanja)}</h3>
        </div>
      </div>

      <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="fw-bold text-dark mb-0 fs-6">Pesanan Terbaru</p>
          <Link to="/akun/pesanan" className="btn btn-sm rounded-3 fw-semibold" style={{ color: '#5C4033', borderColor: '#5C4033' }}>Lihat semua</Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-muted small mb-0">Belum ada pesanan.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Gambar</th>
                  <th>Produk</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Bayar</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-semibold">#{order.id}</td>
                    <td><img src={mediaUrl(order.produk_gambar)} alt={order.nama_produk} className="rounded border" style={{ width: '40px', height: '40px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/></td>
                    <td className="fw-semibold">{order.nama_produk || '-'}</td>
                    <td className="fw-bold" style={{ color: '#D8838B' }}>{formatRupiah(order.produk_harga || 0)}</td>
                    <td>
                      <span className={`badge bg-${order.status === 'Selesai' ? 'success' : order.status === 'Diterima' ? 'info' : order.status === 'Dikirim' ? 'primary' : order.status === 'Dikemas' ? 'warning' : 'secondary'}`}>
                        {order.status || 'Tertunda'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge bg-${order.pembayaran === 'Dibayar' ? 'success' : 'danger'}`}>
                        {order.pembayaran || 'Belum'}
                      </span>
                    </td>
                    <td className="text-muted">{formatTanggal(order.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <Link to="/toko" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-4 text-center hover-shadow transition">
              <i className="bi bi-cart-plus fs-1 d-block mb-2" style={{ color: '#D8838B' }}></i>
              <p className="fw-bold">Belanja Produk</p>
              <p className="text-muted small mb-0">Cari dan beli produk terbaru</p>
            </div>
          </Link>
        </div>
        <div className="col-12 col-md-4">
          <Link to="/akun/pesanan" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-4 text-center hover-shadow transition">
              <i className="bi bi-box-seam fs-1 d-block mb-2" style={{ color: '#8D7B68' }}></i>
              <p className="fw-bold">Riwayat Pesanan</p>
              <p className="text-muted small mb-0">Lihat semua pesanan Anda</p>
            </div>
          </Link>
        </div>
        <div className="col-12 col-md-4">
          <Link to="/akun/profil" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-4 text-center hover-shadow transition">
              <i className="bi bi-person fs-1 d-block mb-2" style={{ color: '#5C4033' }}></i>
              <p className="fw-bold">Edit Profil</p>
              <p className="text-muted small mb-0">Perbarui data diri Anda</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}