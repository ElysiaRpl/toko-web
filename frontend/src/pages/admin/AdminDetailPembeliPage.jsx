// frontend/src/pages/admin/AdminDetailPembeliPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { mediaUrl, formatTanggal, onImgError } from '../../utils';
import { KELAMIN } from '../../constants';

export default function AdminDetailPembeliPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [pembeli, setPembeli] = useState(null);

  useEffect(() => {
    const fetchPembeli = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getPembeliById(id);
        setPembeli(res.data || res);
      } catch (err) {
        console.error('Error fetching pembeli:', err);
        setErrorMsg(err.message || 'Gagal memuat data pembeli');
      } finally {
        setLoading(false);
      }
    };

    fetchPembeli();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#D8838B' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2" style={{ color: '#8D7B68' }}>Memuat data pembeli...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="alert alert-danger text-center py-5" role="alert">
        <i className="bi bi-exclamation-triangle-fill fs-3 d-block mb-2"></i>
        {errorMsg}
        <div className="mt-3">
          <Link to="/admin/pembeli" className="btn btn-sm px-3 py-1 rounded-3 fw-semibold" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>Kembali ke Daftar Pembeli</Link>
        </div>
      </div>
    );
  }

  if (!pembeli) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-person fs-1 d-block mb-3 text-secondary"></i>
        <h5 className="text-secondary">Pembeli tidak ditemukan</h5>
        <Link to="/admin/pembeli" className="btn btn-outline-success btn-sm mt-3">
          Kembali ke Daftar Pembeli
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1 text-dark fs-3">Detail Pembeli #{pembeli.id}</p>
            <p className="text-muted small mb-0">Informasi lengkap akun pembeli.</p>
          </div>
          <div className="d-flex gap-2">
            <Link to={`/admin/pembeli/edit/${pembeli.id}`} className="btn btn-dark btn-sm px-3 fw-semibold"><i className="bi bi-pencil me-1"></i> Edit</Link>
            <Link to="/admin/pembeli" className="btn btn-outline-secondary btn-sm px-3 py-1">Kembali</Link>
          </div>
        </div>

        <div className="card border-0 shadow-sm bg-white rounded-3 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-3 text-center p-4" style={{ backgroundColor: '#F7F5F0' }}>
              <div className="rounded-circle overflow-hidden border bg-white mx-auto" style={{ width: '150px', height: '150px' }}>
                <img src={mediaUrl(pembeli.foto)} alt={pembeli.nama_d} className="w-100 h-100 object-fit-cover" onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
              </div>
              <p className="fw-bold mt-3 mb-0">{pembeli.nama_d} {pembeli.nama_b}</p>
              <span className={`badge ${pembeli.role === 'admin' ? 'bg-danger' : 'bg-success'} mt-1`}>
                {pembeli.role || 'pembeli'}
              </span>
              <p className="text-muted small mt-2 mb-0">Bergabung: {formatTanggal(pembeli.created_at)}</p>
            </div>

            <div className="col-md-9 p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small mb-0">Nama Depan</label>
                  <p className="text-secondary">{pembeli.nama_d || '-'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small mb-0">Nama Belakang</label>
                  <p className="text-secondary">{pembeli.nama_b || '-'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small mb-0">Jenis Kelamin</label>
                  <p className="text-secondary">{pembeli.kelamin || '-'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small mb-0">Tanggal Lahir</label>
                  <p className="text-secondary">{pembeli.lahir || '-'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small mb-0">Email</label>
                  <p className="text-secondary">{pembeli.email || '-'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small mb-0">Username</label>
                  <p className="text-secondary">{pembeli.uname || '-'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small mb-0">Nomor Telepon</label>
                  <p className="text-secondary">{pembeli.phone || '-'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small mb-0">Role</label>
                  <p className="text-secondary">
                    <span className={`badge ${pembeli.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>{pembeli.role || 'pembeli'}</span></p>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold text-dark small mb-0">Alamat</label>
                  <p className="text-secondary">{pembeli.alamat || '-'}</p>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark small mb-0">Terakhir Diupdate</label>
                  <p className="text-secondary">{formatTanggal(pembeli.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}