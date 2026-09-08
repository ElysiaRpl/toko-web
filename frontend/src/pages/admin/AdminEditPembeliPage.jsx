// frontend/src/pages/admin/AdminEditPembeliPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { getToken, mediaUrl, onImgError } from '../../utils';
import { KELAMIN } from '../../constants';

export default function AdminEditPembeliPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    nama_d: '',
    nama_b: '',
    kelamin: 'Laki-laki',
    lahir: '',
    alamat: '',
    phone: '',
    email: '',
    uname: '',
    role: 'pembeli',
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentFoto, setCurrentFoto] = useState(null);

  // Ambil data pembeli
  useEffect(() => {
    const fetchPembeli = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getPembeliById(id);
        const data = res.data || res;

        setFormData({
          nama_d: data.nama_d || '',
          nama_b: data.nama_b || '',
          kelamin: data.kelamin || 'Laki-laki',
          lahir: data.lahir || '',
          alamat: data.alamat || '',
          phone: data.phone || '',
          email: data.email || '',
          uname: data.uname || '',
          role: data.role || 'pembeli',
        });

        if (data.foto) {
          setCurrentFoto(data.foto);
          setPreview(mediaUrl(data.foto));
        }
      } catch (err) {
        console.error('Error fetching pembeli:', err);
        setErrorMsg(err.message || 'Gagal memuat data pembeli');
      } finally {
        setLoading(false);
      }
    };

    fetchPembeli();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setSubmitting(true);
      const token = getToken();

      const dataPayload = new FormData();
      dataPayload.append('nama_d', formData.nama_d);
      dataPayload.append('nama_b', formData.nama_b);
      dataPayload.append('kelamin', formData.kelamin);
      
      const lahirFormatted = formData.lahir ? new Date(formData.lahir).toISOString().split('T')[0] : '';
      dataPayload.append('lahir', lahirFormatted);
      
      dataPayload.append('alamat', formData.alamat);
      dataPayload.append('phone', formData.phone);
      dataPayload.append('email', formData.email);
      dataPayload.append('uname', formData.uname);
      dataPayload.append('role', formData.role);

      // Kirim password hanya jika diisi
      if (formData.passwd && formData.passwd.trim() !== '') {
        dataPayload.append('passwd', formData.passwd);
      }

      // Ubah dari 'foto' menjadi 'gambar' agar sesuai dengan backend (.single("gambar"))
      if (fotoFile) {
        dataPayload.append('gambar', fotoFile);
      }

      const response = await fetch(`http://localhost:5000/api/admin/pembeli/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataPayload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal memperbarui data pembeli');
      }

      navigate('/admin/pembeli');
    } catch (err) {
      console.error('Error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan pada server');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-muted">Memuat data pembeli...</div>;
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1 fs-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Edit Pembeli #{id}</p>
            <p className="text-muted small mb-0">Ubah informasi akun pembeli di bawah ini.</p>
          </div>
          <Link to="/admin/pembeli" className="btn btn-sm px-3 py-1 rounded-3 fw-semibold" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>Kembali</Link>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="card border-0 shadow-sm bg-white p-4 rounded-3">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nama Depan <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="nama_d" value={formData.nama_d} onChange={handleChange} required/>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nama Belakang <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="nama_b" value={formData.nama_b} onChange={handleChange} required/>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Jenis Kelamin</label>
                <select className="form-select form-select-sm" name="kelamin" value={formData.kelamin} onChange={handleChange}>
                  {KELAMIN.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Tanggal Lahir</label>
                <input type="text" className="form-control form-control-sm" name="lahir" value={formData.lahir} onChange={handleChange}/>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nomor Telepon</label>
                <input type="text" className="form-control form-control-sm" name="phone" value={formData.phone} onChange={handleChange} placeholder="+62xxxxxxxxxx"/>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Email <span className="text-danger">*</span></label>
                <input type="email" className="form-control form-control-sm" name="email" value={formData.email} onChange={handleChange} required/>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Username <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="uname" value={formData.uname} onChange={handleChange} required/>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Role <span className="text-danger">*</span></label>
                <select className="form-select form-select-sm" name="role" value={formData.role} onChange={handleChange} required>
                  <option value="pembeli">Pembeli</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Password Baru (Opsional)</label>
                <input type="password" className="form-control form-control-sm" name="passwd" placeholder="Kosongkan jika tidak ingin mengubah password"onChange={handleChange}/>
                <small className="text-muted" style={{ fontSize: '11px' }}>Isi hanya jika ingin mengganti password (minimal 6 karakter).</small>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Alamat</label>
                <textarea className="form-control form-control-sm" rows="2" name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Alamat lengkap pembeli..."/>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Ganti Foto (Opsional)</label>
                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={handleImageChange}/>
                <small className="text-muted" style={{ fontSize: '11px' }}>Biarkan kosong jika tidak ingin mengubah foto.</small>
              </div>

              <div className="col-12">
                <p className="form-label fw-semibold small mb-1" style={{ color: '#2A1E17' }}>Preview Foto:</p>
                <div className="border rounded-3 p-2 d-inline-block" style={{ backgroundColor: '#FAF0E6', borderColor: '#8D7B68' }}>
                  {preview ? (
                    <img src={preview} alt="Preview Foto" className="rounded-circle" style={{ width: '80px', height: '80px', objectFit: 'cover' }}onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
                  ) : currentFoto ? (
                    <img src={mediaUrl(currentFoto)} alt="Foto Saat Ini" className="rounded-circle" style={{ width: '80px', height: '80px', objectFit: 'cover' }} onError={(e) => { e.target.src = '/placeholder-image.jpg';}}
                    />
                  ) : (
                    <div className="text-muted small p-3">Tidak ada foto</div>
                  )}
                </div>
              </div>

              <div className="col-12 d-flex gap-2 pt-2">
                <button type="submit" className="btn text-white btn-sm px-4 fw-semibold rounded-3 border-0" style={{ backgroundColor: '#D8838B' }} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                <Link to="/admin/pembeli" className="btn btn-sm px-3 rounded-3" style={{ color: '#2A1E17', backgroundColor: '#FAF0E6', border: '1px solid #8D7B68' }}>Batal</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}