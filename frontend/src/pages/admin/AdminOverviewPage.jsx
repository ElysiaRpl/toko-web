// frontend/src/pages/admin/AdminOverviewPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { formatRupiah, formatTanggal } from '../../utils';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    pembeli: 0,
    totalTransaksi: 0,
    produkKatalog: 0,
    produkTerjual: 0,
    artikel: 0,
    pesananAktif: 0,
    belumDibayar: 0,
    dikirim: 0,
    pendapatan: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        
        const res = await adminApi.getStats();
        const data = res.data;
        const rawStats = data.stats || {};

        const hitungPesananAktif = 
          Number(rawStats.tertunda || 0) +
          Number(rawStats.dikemas || 0) +
          Number(rawStats.dikirim || 0) +
          Number(rawStats.diterima || 0);

        const pesananAktifVal = rawStats.pesanan_aktif !== undefined 
          ? Number(rawStats.pesanan_aktif) 
          : hitungPesananAktif;

        const produkTerjualVal = Number(rawStats.total_terjual ?? rawStats.total_pembelian ?? 0);

        const belumDibayarVal = Number(rawStats.belum_dibayar ?? rawStats.belum_bayar ?? 0);
        
        setStats({
          pembeli: Number(rawStats.total_pembeli || 0),
          totalTransaksi: Number(rawStats.total_pembelian || 0),
          produkKatalog: Number(rawStats.total_produk || 0),
          produkTerjual: produkTerjualVal,
          artikel: Number(rawStats.total_artikel || 0),
          pesananAktif: pesananAktifVal,
          belumDibayar: belumDibayarVal,
          dikirim: Number(rawStats.dikirim || 0),
          pendapatan: Number(rawStats.pendapatan || 0)
        });
        
        setRecentOrders(data.recent_pembelian || []);
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
        setError(err.message || 'Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary">Memuat dashboard...</p>
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
      <div className="container-fluid p-0">
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #f0ad4e' }}>
              <span className="text-secondary fw-bold small text-uppercase">Pembeli Terdaftar</span>
              <p className="fw-bold my-2 text-dark fs-2">{stats.pembeli}</p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #333' }}>
              <span className="text-secondary fw-bold small text-uppercase">Total Transaksi</span>
              <p className="fw-bold my-2 text-dark fs-2">{stats.totalTransaksi}</p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #f0ad4e' }}>
              <span className="text-secondary fw-bold small text-uppercase">Produk di Katalog</span>
              <p className="fw-bold my-2 text-dark fs-2">{stats.produkKatalog}</p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #f0ad4e' }}>
              <span className="text-secondary fw-bold small text-uppercase">Produk Terjual</span>
              <p className="fw-bold my-1 text-dark fs-2">{stats.produkTerjual}</p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #f0ad4e' }}>
              <span className="text-secondary fw-bold small text-uppercase">Artikel</span>
              <p className="fw-bold my-2 text-dark fs-2">{stats.artikel}</p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #dc3545' }}>
              <span className="text-secondary fw-bold small text-uppercase">Pesanan Aktif</span>
              <p className="fw-bold my-2 text-dark fs-2">{stats.pesananAktif}</p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #dc3545' }}>
              <span className="text-secondary fw-bold small text-uppercase">Belum Dibayar</span>
              <p className="fw-bold my-2 text-dark fs-2">{stats.belumDibayar}</p>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 p-3" style={{ borderLeft: '4px solid #0d6efd' }}>
              <span className="text-secondary fw-bold small text-uppercase">Pesanan Dikirim</span>
              <p className="fw-bold my-2 text-dark fs-2">{stats.dikirim || 0}</p>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="fw-bold mb-1" style={{ color: '#2A1E17' }}>Pendapatan (dibayar)</p>
              <p className="text-muted small mb-0">Total dari pesanan dengan status pembayaran "Dibayar".</p>
            </div>
            <p className="fw-bold mb-0 fs-3" style={{ color: '#D8838B' }}>{formatRupiah(stats.pendapatan)}</p>
          </div>
        </div>

        <div className="card border-0 shadow-sm p-4 mb-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="fw-bold mb-0" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Transaksi terbaru</p>
            <Link to="/admin/pesanan" className="btn btn-sm rounded-3 fw-semibold" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>Lihat semua</Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-muted small mb-0">Belum ada pesanan.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle small">
                <thead className="small text-uppercase" style={{ backgroundColor: '#FAF0E6', color: '#2A1E17' }}>
                  <tr>
                    <th>ID Pesanan</th>
                    <th>Pembeli</th>
                    <th>Tanggal</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="fw-semibold" style={{ color: '#2A1E17' }}>#{order.id}</td>
                      <td>{order.nama_pembeli || order.user_nama_d || '-'}</td>
                      <td>{formatTanggal(order.created_at)}</td>
                      <td className="fw-bold" style={{ color: '#D8838B' }}>{formatRupiah(order.produk_harga ?? order.harga ?? order.total_harga ?? 0)}</td>
                      <td>
                        <span className={`badge ${order.pembayaran === 'Dibayar' ? 'bg-success' : 'bg-warning'}`}>
                          {order.pembayaran || 'Belum'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="d-flex gap-2">
          <Link to="/admin/produk" className="btn text-white btn-sm px-3 fw-semibold rounded-3 border-0" style={{ backgroundColor: '#D8838B' }}>+ Tambah produk</Link>
          <Link to="/admin/artikel" className="btn btn-sm px-3 fw-semibold rounded-3" style={{ color: '#2A1E17', backgroundColor: '#FAF0E6', border: '1px solid #8D7B68' }}>+ Tulis artikel</Link>
          <Link to="/" className="btn btn-outline-secondary btn-sm px-3 fw-semibold rounded-3" style={{ color: '#8D7B68', borderColor: '#8D7B68' }} target="_blank">Lihat Beranda</Link>
        </div>
      </div>
    </>
  );
}