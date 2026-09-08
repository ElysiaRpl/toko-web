// frontend/src/pages/pembeli/PembeliPesananPage.jsx
import { useState, useEffect } from 'react';
import { pembeliApi } from '../../api';
import { formatRupiah, formatTanggal, mediaUrl, onImgError } from '../../utils';

export default function PembeliPesananPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await pembeliApi.getPembelian();
        setOrders(res.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Gagal memuat pesanan');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      'Tertunda': 'bg-warning',
      'Dikemas': 'bg-info',
      'Dikirim': 'bg-primary',
      'Diterima': 'bg-success',
      'Selesai': 'bg-secondary'
    };
    return colors[status] || 'bg-secondary';
  };

  const getBayarBadge = (pembayaran) => {
    return pembayaran === 'Dibayar' ? 'bg-success' : 'bg-danger';
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#D8838B' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary">Memuat pesanan...</p>
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
        <div className="mb-4">
          <p className="fw-bold fs-3 mb-1" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Pesanan Saya</p>
          <p className="text-muted small">{orders.length} pesanan</p>
        </div>

        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small text-uppercase" style={{ fontSize: '12px' }}>
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3">Gambar</th>
                  <th className="py-3">Produk</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Bayar</th>
                  <th className="py-3">Kurir</th>
                  <th className="py-3">Tanggal</th>
                  <th className="py-3 text-end px-3">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan="9" className="text-center py-4 text-muted small">Belum ada pesanan.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-3 fw-semibold">#{order.id}</td>
                      <td><img src={mediaUrl(order.produk_gambar)} alt={order.nama_produk} className="rounded border" style={{ width: '50px', height: '40px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}} /></td>
                      <td className="fw-semibold">{order.nama_produk || '-'}</td>
                      <td className="fw-bold" style={{ color: '#D8838B' }}>{formatRupiah(order.produk_harga || 0)}</td>
                      <td><span className={`badge ${getStatusBadge(order.status)}`}>{order.status || 'Tertunda'}</span></td>
                      <td><span className={`badge ${getBayarBadge(order.pembayaran)}`}>{order.pembayaran || 'Belum'}</span> </td>
                      <td className="text-muted small">{order.pengiriman || '-'}</td>
                      <td className="text-muted small">{formatTanggal(order.created_at)}</td>
                      <td className="text-end px-3">
                        <button onClick={() => setSelectedOrder(order)} className="btn btn-sm rounded-3 py-1 px-3 fw-semibold" style={{ fontSize: '12px', color: '#5C4033', borderColor: '#5C4033' }}>Detail</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* POPUP MODAL DETAIL PESANAN */}
      {selectedOrder && (
        <div className="modal fade show d-block"  tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-scrollable modal-md">
            <div className="modal-content border-0 shadow-lg rounded-3">
              
              {/* Header Modal */}
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Detail Pesanan #{selectedOrder.id}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>

              {/* Body Modal */}
              <div className="modal-body px-4">
                {/* Gambar Produk */}
                <div className="mb-3">
                  <p className="text-muted small mb-2">Produk</p>
                  <img src={mediaUrl(selectedOrder.produk_gambar)} alt={selectedOrder.nama_produk} className="img-fluid rounded border w-100" style={{ maxHeight: '200px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}/>
                </div>

                {/* Box Info Transfer */}
                <div className="p-3 rounded-3 mb-4" style={{ backgroundColor: '#FAF0E6', border: '1px solid #E8D3C5' }}>
                  <p className="fw-bold mb-1 small text-dark">Rekening tujuan transfer</p>
                  <p className="small mb-2 text-secondary">Jumlah transfer: <strong className="text-dark">{formatRupiah(selectedOrder.produk_harga || 0)}</strong> — cantumkan <strong>#{selectedOrder.id}</strong> di berita transfer</p>
                  <p className="small mb-1"><strong>BCA</strong> 1234567890</p>
                  <p className="small mb-0"><strong>Mandiri</strong> 9876543210</p>
                </div>

                {/* Form Upload Bukti Transfer */}
                <div className="mb-4 p-3 border rounded bg-light">
                  <label className="fw-bold small mb-1 text-dark d-block">Bukti Pembayaran</label>
                  {selectedOrder.foto_bukti ? (
                    <div className="mt-2">
                      <img src={mediaUrl(selectedOrder.foto_bukti)} alt="Bukti Transfer" className="img-fluid rounded border"  style={{ maxHeight: '150px' }}/>
                      <p className="text-success small mt-1 mb-0">✓ Bukti transfer telah diunggah</p>
                    </div>
                  ) : (
                    <div>
                      <input type="file" accept="image/*"className="form-control form-control-sm mb-2" onChange={(e) => {const file = e.target.files[0];if (file) {console.log('File terpilih:', file);}}}/>
                      <span className="text-muted" style={{ fontSize: '11px' }}>Format: JPG, PNG (Maks 2MB)</span>
                    </div>
                  )}
                </div>

                {/* Detail Informasi Sesuai Database */}
                <div className="small">
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">ID PESANAN</div>
                    <div className="col-7 text-dark">{selectedOrder.id}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">PRODUK</div>
                    <div className="col-7 text-dark">{selectedOrder.nama_produk || '-'}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">HARGA</div>
                    <div className="col-7 text-dark">{formatRupiah(selectedOrder.produk_harga || 0)}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">NAMA PENERIMA</div>
                    <div className="col-7 text-dark">{selectedOrder.nama_pembeli || '-'}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">ALAMAT KIRIM</div>
                    <div className="col-7 text-dark">{selectedOrder.alamat_pembeli || '-'}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">TELEPON</div>
                    <div className="col-7 text-dark">{selectedOrder.phone_pembeli || '-'}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">METODE BAYAR</div>
                    <div className="col-7 text-dark">{selectedOrder.metode_pembayaran || 'Bank Transfer'}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">STATUS BAYAR</div>
                    <div className="col-7 text-dark">{selectedOrder.pembayaran || 'Belum'}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">KURIR</div>
                    <div className="col-7 text-dark">{selectedOrder.pengiriman || '-'}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">STATUS PESANAN</div>
                    <div className="col-7 text-dark">{selectedOrder.status || 'Tertunda'}</div>
                  </div>
                  <div className="row py-2 border-bottom">
                    <div className="col-5 text-muted fw-semibold">CATATAN</div>
                    <div className="col-7 text-dark">{selectedOrder.catatan || '-'}</div>
                  </div>
                  <div className="row py-2">
                    <div className="col-5 text-muted fw-semibold">TANGGAL</div>
                    <div className="col-7 text-dark">{formatTanggal(selectedOrder.created_at)}</div>
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="modal-footer border-0 pt-0 px-4 pb-3">
                <button type="button" className="btn rounded-3 w-100 py-2 fw-semibold" style={{ color: '#5C4033', borderColor: '#5C4033' }} onClick={() => setSelectedOrder(null)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>`
    </>
  );
}