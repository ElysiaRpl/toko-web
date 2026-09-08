// frontend/src/pages/admin/AdminArtikelPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { mediaUrl, formatTanggal, onImgError } from '../../utils';

export default function AdminArtikelPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // Ambil data artikel
  const loadArtikel = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getArtikel();
      console.log('📦 Response artikel:', res);
      setItems(res.data || []);
    } catch (err) {
      console.error('Error fetching artikel:', err);
      setErrorMsg(err.message || 'Gagal memuat daftar artikel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtikel();
  }, []);

  // Hapus artikel
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await adminApi.deleteArtikel(deleteId);
      setDeleteId(null);
      loadArtikel(); // Refresh data
    } catch (err) {
      alert(`Gagal hapus: ${err.message}`);
    }
  };

  // Truncate text untuk ringkasan
  const truncateText = (text, maxLength = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
  return <div className="p-4 text-center" style={{ color: '#8D7B68' }}>Memuat daftar artikel...</div>;
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1 text-dark fs-3">Kelola Artikel</p>
            <p className="text-muted small mb-0">Artikel & blog</p>
          </div>
          <Link to="/admin/artikel/tambah" className="btn btn-dark btn-sm px-3 fw-semibold">
            <i className="bi bi-plus-lg me-1"></i> Artikel baru
          </Link>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="small mb-0" style={{ color: '#8D7B68' }}>{items.length} artikel</p>
        </div>

        {items.length === 0 ? (
          <div className="card border-0 shadow-sm p-4 text-center rounded-3" style={{ backgroundColor: '#FAF0E6' }}>
            <i className="bi bi-newspaper fs-1 d-block mb-3" style={{ color: '#8D7B68' }}></i>
            <p className="mb-0" style={{ color: '#8D7B68' }}>Belum ada artikel.</p>
            <Link to="/admin/artikel/tambah" className="btn text-white btn-sm mt-3 rounded-3 border-0 px-3" style={{ backgroundColor: '#D8838B' }}>Tambah artikel pertama</Link>
          </div>
        ) : (
          <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="small text-uppercase" style={{ fontSize: '12px', backgroundColor: '#FAF0E6', color: '#2A1E17' }}>
                  <tr>
                    <th className="py-3 px-3">GAMBAR</th>
                    <th className="py-3">JUDUL</th>
                    <th className="py-3">RINGKASAN</th>
                    <th className="py-3">TANGGAL</th>
                    <th className="py-3 text-end px-3">TINDAKAN</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3" style={{ width: '80px' }}>
                        <img src={mediaUrl(item.gambar)} alt={item.judul} className="rounded border" style={{ width: '60px', height: '45px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/></td>
                      <td className="fw-semibold text-dark">{item.judul}</td>
                      <td className="text-muted small">{truncateText(item.ringkasan || item.isi || '', 120)}</td>
                      <td className="text-muted small">{formatTanggal(item.created_at)}</td>
                      <td className="text-end px-3">
                        <div className="d-flex justify-content-end gap-1">
                          <Link to={`/admin/artikel/${item.id}`} className="btn btn-sm py-0 px-2 rounded-2" style={{ fontSize: '12px', color: '#8D7B68', borderColor: '#8D7B68' }}>Detail</Link>
                          <Link to={`/admin/artikel/edit/${item.id}`} className="btn btn-sm py-0 px-2 rounded-2" style={{ fontSize: '12px', color: '#8D7B68', borderColor: '#8D7B68' }}>Edit</Link>
                          <button onClick={() => setDeleteId(item.id)} className="btn btn-sm btn-outline-danger py-0 px-2" style={{ fontSize: '12px' }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {deleteId && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <p className="modal-title">Hapus Artikel?</p>
                  <button type="button" className="btn-close" onClick={() => setDeleteId(null)}></button>
                </div>
                <div className="modal-body">
                  <p>Artikel yang dihapus tidak bisa dikembalikan. Apakah Anda yakin?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary btn-sm" onClick={() => setDeleteId(null)}>Batal</button>
                  <button className="btn btn-danger btn-sm" onClick={handleDelete}><i className="bi bi-trash me-1"></i> Hapus</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}