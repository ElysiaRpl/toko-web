// frontend/src/pages/admin/AdminPembelianPage.jsx
import { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { formatRupiah, formatTanggal, mediaUrl, onImgError } from '../../utils';

export default function AdminPembelianPage() {
  const [pembelian, setPembelian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // State untuk Modal Detail Pesanan
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Ambil data pembelian
  const fetchPembelian = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPembelian();
      console.log('📦 Response pembelian:', res);
      setPembelian(res.data || []);
    } catch (err) {
      console.error('Error fetching pembelian:', err);
      setErrorMsg(err.message || 'Gagal memuat daftar pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPembelian();
  }, []);

  // Update status pesanan (Pengiriman/Proses)
  const handleUpdateStatus = async (id, newStatus) => {
    // 🛑 VALIDASI KETAT: Jika ingin diubah ke 'Selesai' tetapi pembayaran belum 'Dibayar'
    const currentPembayaran = selectedOrder?.pembayaran || 'Belum';
    if (newStatus === 'Selesai' && currentPembayaran !== 'Dibayar') {
      alert('⚠️ Gagal! Pesanan belum dibayar. Status pesanan tidak bisa diubah menjadi "Selesai" sebelum status pembayaran menjadi "Dibayar".');
      return;
    }

    if (!window.confirm(`Ubah status pesanan #${id} menjadi "${newStatus}"?`)) return;

    try {
      await adminApi.updatePembelian(id, { status: newStatus });
      
      // Update data di modal yang sedang dibuka
      if (selectedOrder) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
      
      // Refresh tabel utama
      fetchPembelian();
    } catch (err) {
      alert(`Gagal update status: ${err.message}`);
    }
  };

  // BARU: Update status pembayaran
  const handleUpdatePembayaran = async (id, newPembayaran) => {
    if (!window.confirm(`Ubah status pembayaran pesanan #${id} menjadi "${newPembayaran}"?`)) return;

    try {
      await adminApi.updatePembelian(id, { pembayaran: newPembayaran });
      
      // Update data di modal yang sedang dibuka
      if (selectedOrder) {
        setSelectedOrder((prev) => ({ ...prev, pembayaran: newPembayaran }));
      }
      
      // Refresh tabel utama
      fetchPembelian();
    } catch (err) {
      alert(`Gagal update status pembayaran: ${err.message}`);
    }
  };

  // Hapus pesanan
  const handleDelete = async (id) => {
    if (!window.confirm('Apakah kamu yakin ingin menghapus pesanan ini?')) return;

    try {
      await adminApi.deletePembelian(id);
      fetchPembelian();
    } catch (err) {
      alert(`Gagal hapus: ${err.message}`);
    }
  };

  // Status badge color
  const getStatusBadge = (status) => {
    const colors = {
      'Tertunda': 'bg-warning bg-opacity-10 text-warning border border-warning',
      'Dikemas': 'bg-info bg-opacity-10 text-info border border-info',
      'Dikirim': 'bg-primary bg-opacity-10 text-primary border border-primary',
      'Diterima': 'bg-success bg-opacity-10 text-success border border-success',
      'Selesai': 'bg-secondary bg-opacity-10 text-secondary border border-secondary',
    };
    return colors[status] || 'bg-secondary';
  };

  // Status pembayaran badge
  const getBayarBadge = (pembayaran) => {
    const colors = {
    'Belum': 'bg-danger bg-opacity-10 text-danger border border-danger',
    'Dibayar': 'bg-success bg-opacity-10 text-success border border-success',
    };
    return colors[pembayaran] || 'bg-secondary bg-opacity-10 text-secondary border border-secondary';
  };

  if (loading) {
    return <div className="p-4 text-center text-muted">Memuat daftar pesanan...</div>;
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1 fs-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Kelola Pesanan</p>
            <p className="text-muted small mb-0">Daftar seluruh transaksi pembelian pelanggan.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden">
         <div className="p-3 border-bottom" style={{ backgroundColor: '#FAF0E6' }}>
            <p className="fw-bold mb-0" style={{ color: '#2A1E17' }}>Daftar pesanan</p>
            <small className="text-muted">{pembelian.length} transaksi</small>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="small text-uppercase" style={{ fontSize: '12px', backgroundColor: '#FAF0E6', color: '#2A1E17' }}>
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3">Pembeli</th>
                  <th className="py-3">Gambar</th>
                  <th className="py-3">Produk</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Bayar</th>
                  <th className="py-3 text-end px-3">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {pembelian.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted small">
                      Belum ada pesanan.
                    </td>
                  </tr>
                ) : (
                  pembelian.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 fw-semibold" style={{ color: '#2A1E17' }}>#{item.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="rounded-circle overflow-hidden border bg-light" style={{ width: '28px', height: '28px' }}>
                            <img src={mediaUrl(item.user_foto || item.foto_pembeli || item.foto || '')} alt={item.nama_pembeli || item.user_nama_d} className="w-100 h-100 object-fit-cover" onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
                          </div>
                          <span className="fw-semibold small">
                            {item.nama_pembeli || `${item.user_nama_d || ''} ${item.user_nama_b || ''}`.trim() || '-'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <img src={mediaUrl(item.produk_gambar)} alt={item.nama_produk} style={{ width: '50px', height: '40px', objectFit: 'cover' }} className="rounded border" onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
                      </td>
                      <td className="fw-semibold small">{item.nama_produk || '-'}</td>
                      <td className="fw-bold" style={{ color: '#D8838B' }}>{formatRupiah(item.produk_harga || 0)}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(item.status)}`}>
                          {item.status || 'Tertunda'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getBayarBadge(item.pembayaran)}`}>
                          {item.pembayaran || 'Belum'}
                        </span>
                      </td>
                      <td className="text-end px-3">
                        <div className="d-flex justify-content-end gap-1">
                          <button onClick={() => setSelectedOrder(item)} className="btn btn-sm py-0 px-2 rounded-3 fw-semibold" style={{ fontSize: '12px', color: '#8D7B68', borderColor: '#8D7B68' }}>Detail</button>
                          <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger py-0 px-2" style={{ fontSize: '12px' }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL DETAIL & UBAH STATUS PESANAN --- */}
        {selectedOrder && (
          <div className="modal fade show d-block"  tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-scrollable modal-lg">
              <div className="modal-content border-0 shadow-lg rounded-3">
                <div className="modal-header border-0 pb-0">
                  <p className="modal-title fw-bold" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Detail Pesanan #{selectedOrder.id}</p>
                  <button type="button" className="btn-close"onClick={() => setSelectedOrder(null)}></button>
                </div>

                <div className="modal-body px-4">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Pembeli</label>
                        <p className="fw-semibold mb-0">{selectedOrder.nama_pembeli || `${selectedOrder.user_nama_d || ''} ${selectedOrder.user_nama_b || ''}`.trim() || '-'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Produk</label>
                        <div className="d-flex align-items-center gap-2">
                          <img src={mediaUrl(selectedOrder.produk_gambar)}  alt={selectedOrder.nama_produk} className="rounded border" style={{ width: '45px', height: '45px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
                          <span className="fw-semibold">{selectedOrder.nama_produk || '-'}</span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Total Harga</label>
                        <p className="fw-bold fs-5 mb-0" style={{ color: '#D8838B' }}>{formatRupiah(selectedOrder.produk_harga || 0)}</p>
                      </div>

                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Alamat Kirim</label>
                        <p className="small text-secondary mb-0">{selectedOrder.alamat_pembeli || '-'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Telepon</label>
                        <p className="small text-secondary mb-0">{selectedOrder.phone_pembeli || '-'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Catatan</label>
                        <p className="small text-secondary mb-0">{selectedOrder.catatan || '-'}</p>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Metode Pembayaran</label>
                        <p className="fw-semibold mb-0">{selectedOrder.metode_pembayaran || 'Bank Transfer'}</p>
                      </div>

                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Status Pembayaran</label>
                        <span className={`badge ${getBayarBadge(selectedOrder.pembayaran)}`}>
                          {selectedOrder.pembayaran || 'Belum'}
                        </span>
                      </div>

                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Metode Pengiriman</label>
                        <p className="fw-semibold mb-0">{selectedOrder.pengiriman || '-'}</p>
                      </div>
                      <div className="mb-3">
                        <label className="text-muted small fw-bold text-uppercase d-block mb-1">Foto Bukti Transfer</label>
                        {selectedOrder.foto_bukti ? (
                          <img  src={mediaUrl(selectedOrder.foto_bukti)}  alt="Bukti Transfer"  className="img-fluid rounded border mt-1" style={{ maxHeight: '160px', objectFit: 'contain' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
                        ) : (
                          <p className="small text-muted fst-italic mb-0">Belum ada bukti transfer yang diunggah.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="my-3" />

                  <div className="mb-3">
                    <label className="fw-bold small d-block mb-2" style={{ color: '#2A1E17' }}>Ubah Status Pembayaran</label>
                    <div className="d-flex gap-2">
                      {['Belum', 'Dibayar'].map((p) => {
                        const isActive = (selectedOrder.pembayaran || 'Belum') === p;
                        return (
                          <button key={p} type="button" onClick={() => handleUpdatePembayaran(selectedOrder.id, p)}className={`btn btn-sm ${isActive ? 'btn-success fw-bold' : 'btn-outline-secondary'}`}style={{ fontSize: '13px' }}>{p}</button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="fw-bold small d-block mb-2" style={{ color: '#2A1E17' }}>Ubah Status Pesanan</label>
                    <div className="d-flex flex-wrap gap-2">
                      {['Tertunda', 'Dikemas', 'Dikirim', 'Diterima', 'Selesai'].map((st) => {
                        const isActive = (selectedOrder.status || 'Tertunda') === st;
                        const badgeClass = getStatusBadge(st);
                        const isSelesaiDisabled = st === 'Selesai' && (selectedOrder.pembayaran || 'Belum') !== 'Dibayar';
                        return (
                          <button key={st} type="button" onClick={() => handleUpdateStatus(selectedOrder.id, st)} className={`btn btn-sm ${ isActive  ? `${badgeClass} fw-bold` : isSelesaiDisabled ? 'btn-light text-muted border opacity-50 cursor-not-allowed' : 'btn-outline-secondary border-opacity-25'}`}style={{ fontSize: '13px', cursor: isSelesaiDisabled ? 'not-allowed' : 'pointer' }}>{st}</button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0 px-4 pb-3">
                  <button type="button" className="btn text-white w-100 py-2 rounded-3 fw-semibold border-0" style={{ backgroundColor: '#2A1E17' }} onClick={() => setSelectedOrder(null)}>Tutup</button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}