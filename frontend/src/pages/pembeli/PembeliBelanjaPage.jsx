// frontend/src/pages/pembeli/PembeliBelanjaPage.jsx

import { useState, useEffect } from 'react';
import { api, pembeliApi } from '../../api';
import ProdukCard from '../../components/common/ProdukCard'; // ← PAKAI ProdukCard
import { mediaUrl } from '../../utils';
import { useAuth } from '../../context/AuthContext';

export default function PembeliBelanjaPage() {
  const [listProduk, setListProduk] = useState([]);
  const { user } = useAuth();

  // State Form Modal Checkout
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [namaPembeli, setNamaPembeli] = useState('');
  const [alamatPembeli, setAlamatPembeli] = useState('');
  const [phonePembeli, setPhonePembeli] = useState('');
  const [metodePembayaran, setMetodePembayaran] = useState('Bank Transfer');
  const [pengiriman, setPengiriman] = useState('JNT Express');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await api.getProduk();
        const dataProduk = res.data || [];
        setListProduk(dataProduk);

        // Cek produk pending dari localStorage
        const pendingId = localStorage.getItem('pending_checkout_product');
        if (pendingId) {
          const found = dataProduk.find(p => p.id_produk == pendingId || p.id == pendingId);
          if (found) {
            openCheckoutModal(found);
          }
          localStorage.removeItem('pending_checkout_product');
        }
      } catch (err) {
        console.error("Gagal memuat produk", err);
      }
    };

    fetchProduk();
  }, []);

  const openCheckoutModal = (product) => {
    setSelectedProduct(product);
    
    const fullName = user ? `${user.nama_d || ''} ${user.nama_b || ''}`.trim() : '';
    
    setNamaPembeli(fullName);
    setAlamatPembeli(user?.alamat || '');
    setPhonePembeli(user?.phone || '');
    setMetodePembayaran('Bank Transfer');
    setPengiriman('JNT Express');
    setCatatan('');
    setShowModal(true);
  };

  const handleSubmitPesanan = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      id_produk: selectedProduct.id_produk || selectedProduct.id,
      metode_pembayaran: metodePembayaran,
      catatan: catatan || undefined,
    };

    try {
      const res = await pembeliApi.createPembelian(payload);
      alert('Pesanan berhasil dibuat!');
      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Gagal membuat pesanan, periksa kembali koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid p-4">
        <p className="fw-bold mb-3 fs-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Belanja Produk</p>
        <div className="row">
          {listProduk.map((item) => (
            <div className="col-md-4 mb-4" key={item.id_produk || item.id}>
              <ProdukCard item={item} onDirectBuy={() => openCheckoutModal(item)} isPembeliPage={true} />
            </div>
          ))}
        </div>

        {/* --- POPUP MODAL CHECKOUT --- */}
        {showModal && selectedProduct && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content p-3 shadow">
                <div className="modal-header border-0 pb-0">
                  <p className="modal-title fw-bold">Checkout: {selectedProduct.nama_produk}</p>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body">
                  <div className="row mb-3 p-2 rounded-3 align-items-center mx-1" style={{ backgroundColor: '#FAF0E6' }}>
                    <div className="col-3">
                      <img src={mediaUrl(selectedProduct.gambar || selectedProduct.foto)} alt={selectedProduct.nama_produk} className="img-fluid rounded" style={{ height: '80px', objectFit: 'cover', width: '100%' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
                    </div>
                    <div className="col-9">
                      <p className="fw-bold mb-1">{selectedProduct.nama_produk}</p>
                      <p className="fw-bold mb-1" style={{ color: '#D8838B' }}>Rp {(selectedProduct.harga || 0).toLocaleString('id-ID')}</p>
                      <small className="text-muted d-block text-truncate">{selectedProduct.deskripsi}</small>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitPesanan}>
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">Nama Penerima</label>
                      <input type="text" className="form-control" value={namaPembeli} onChange={(e) => setNamaPembeli(e.target.value)} required />
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">Alamat Pengiriman</label>
                      <textarea className="form-control" rows="2" value={alamatPembeli} onChange={(e) => setAlamatPembeli(e.target.value)} required />
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label small fw-bold text-secondary">No. Telepon / Phone</label>
                        <input type="text" className="form-control" value={phonePembeli} onChange={(e) => setPhonePembeli(e.target.value)} required />
                      </div>
                      
                      <div className="col-md-4 mb-3">
                        <label className="form-label small fw-bold text-secondary">Metode Pembayaran</label>
                        <select className="form-select" value={metodePembayaran} onChange={(e) => setMetodePembayaran(e.target.value)}>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="COD">COD</option>
                        </select>
                      </div>

                      <div className="col-md-4 mb-3">
                        <label className="form-label small fw-bold text-secondary">Pengiriman</label>
                        <select className="form-select" value={pengiriman} onChange={(e) => setPengiriman(e.target.value)}>
                          <option value="JNT Express">JNT Express</option>
                          <option value="JNE">JNE</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label small fw-bold text-secondary">Catatan (Opsional)</label>
                      <input type="text" className="form-control" placeholder="Contoh: Titipkan di satpam" value={catatan} onChange={(e) => setCatatan(e.target.value)} />
                    </div>

                    <button type="submit" className="btn text-white w-100 fw-bold py-2 mt-2 rounded-3 border-0 shadow-sm" style={{ backgroundColor: '#D8838B' }} disabled={loading}>{loading ? 'Memproses Pesanan...' : 'Buat Pesanan'}</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}