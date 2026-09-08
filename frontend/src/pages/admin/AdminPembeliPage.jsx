// frontend/src/pages/admin/AdminPembeliPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { mediaUrl, formatTanggal, onImgError } from '../../utils';

export default function AdminPembeliPage() {
  const [pembeliList, setPembeliList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchPembeli = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPembeli(); // ← Pakai adminApi
      setPembeliList(res.data || []);
    } catch (err) {
      console.error('Error fetching pembeli:', err);
      setErrorMsg(err.message || 'Gagal memuat daftar pembeli');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPembeli();
  }, []);

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Apakah kamu yakin ingin menghapus akun pembeli "${nama || 'ini'}"?`)) {
      return;
    }

    try {
      await adminApi.deletePembeli(id); // ← Pakai adminApi
      setPembeliList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(`Gagal: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-muted">Memuat daftar pembeli...</div>;
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1 fs-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Kelola Pembeli</p>
            <p className="text-muted small mb-0">Daftar seluruh akun pembeli yang terdaftar di sistem.</p>
          </div>
          <Link to="/admin/pembeli/tambah" className="btn btn-sm px-3 fw-semibold text-white border-0 rounded-3 shadow-sm" style={{ backgroundColor: '#D8838B' }}><i className="bi bi-plus-lg me-1"></i> Pembeli baru</Link>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden">
          <div className="p-3 border-bottom" style={{ backgroundColor: '#FAF0E6' }}>
            <p className="fw-bold mb-0" style={{ color: '#2A1E17' }}>Daftar pembeli</p>
            <small className="text-muted">{pembeliList.length} akun pembeli</small>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="small text-uppercase" style={{ fontSize: '12px', backgroundColor: '#FAF0E6', color: '#2A1E17' }}>
                <tr>
                  <th className="py-3 px-3">Foto</th>
                  <th className="py-3">Nama</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Username</th>
                  <th className="py-3">Telepon</th>
                  <th className="py-3">Daftar</th>
                  <th className="py-3 text-end px-3">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {pembeliList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted small">Belum ada akun pembeli. Klik &quot;Pembeli baru&quot; untuk menambah.</td>
                  </tr>
                ) : (
                  pembeliList.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2">
                        <div className="rounded-circle overflow-hidden border bg-light" style={{ width: '38px', height: '38px' }}>
                          <img src={mediaUrl(item.foto || item.gambar)} alt={item.nama_d || 'Foto Pembeli'} className="w-100 h-100 object-fit-cover" onError={(e) => {e.target.src = '/placeholder-image.jpg';}}/>
                        </div>
                      </td>
                      <td className="fw-semibold" style={{ color: '#2A1E17' }}>{item.nama_d || '-'} {item.nama_b || ''}</td>
                      <td className="text-muted small">{item.email || '-'}</td>
                      <td className="text-muted small">{item.uname || '-'}</td>
                      <td className="text-muted small">{item.phone || '-'}</td>
                      <td className="text-muted small">{formatTanggal(item.created_at || item.tanggal_daftar)}</td>
                      <td className="text-end px-3">
                        <div className="d-flex justify-content-end gap-1">
                          <Link to={`/admin/pembeli/${item.id}`} className="btn btn-sm py-0 px-2 rounded-3 fw-semibold" style={{ fontSize: '13px', color: '#8D7B68', borderColor: '#8D7B68' }}>Detail</Link>
                          <Link to={`/admin/pembeli/edit/${item.id}`} className="btn btn-sm py-0 px-2 rounded-3 fw-semibold" style={{ fontSize: '13px', color: '#8D7B68', borderColor: '#8D7B68' }}>Ubah</Link>
                          <button onClick={() => handleDelete(item.id, item.nama)}className="btn btn-sm btn-outline-danger py-0 px-2"style={{ fontSize: '13px' }}>Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}