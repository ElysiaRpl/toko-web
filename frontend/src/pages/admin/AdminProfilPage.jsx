import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ← IMPORT useAuth
import { adminApi } from '../../api';
import { getToken, mediaUrl, onImgError } from '../../utils';
import { KELAMIN } from '../../constants';

export default function AdminProfilPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth(); // ← Ambil updateUser dari AuthContext

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    nama_d: '',
    nama_b: '',
    kelamin: 'Laki-laki',
    lahir: '',
    alamat: '',
    phone: '',
    email: '',
    uname: '',
    foto: '',
  });

  const [fotoFile, setFotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentFoto, setCurrentFoto] = useState(null);

  // Password fields
  const [passwordData, setPasswordData] = useState({
    passwd_lama: '',
    passwd_baru: '',
    passwd_confirm: '',
  });

  // Ambil data profil admin
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await adminApi.getMe();
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
          foto: data.foto || '',
        });

        if (data.foto) {
          setCurrentFoto(data.foto);
          setPreview(mediaUrl(data.foto));
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setErrorMsg(err.message || 'Gagal memuat data profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
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
    setSuccessMsg('');

    if (!formData.nama_d || !formData.nama_b || !formData.email || !formData.uname) {
      setErrorMsg('Nama depan, nama belakang, email, dan username wajib diisi!');
      return;
    }

    try {
      setSubmitting(true);
      const token = getToken();

      const dataPayload = new FormData();
      dataPayload.append('nama_d', formData.nama_d);
      dataPayload.append('nama_b', formData.nama_b);
      dataPayload.append('kelamin', formData.kelamin || 'Laki-laki');
      dataPayload.append('lahir', formData.lahir || '');
      dataPayload.append('alamat', formData.alamat || '');
      dataPayload.append('phone', formData.phone || '');
      dataPayload.append('email', formData.email);
      dataPayload.append('uname', formData.uname);

      if (fotoFile) {
        dataPayload.append('foto', fotoFile);
      }

      if (passwordData.passwd_baru && passwordData.passwd_baru.trim() !== '') {
        dataPayload.append('passwd_lama', passwordData.passwd_lama);
        dataPayload.append('passwd_baru', passwordData.passwd_baru);
      }

      const response = await fetch('http://localhost:5000/api/admin/me', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: dataPayload,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal memperbarui profil');
      }

      // ✅ UPDATE AuthContext dengan data terbaru
      const updatedUser = result.data;
      updateUser(updatedUser); // ← Panggil updateUser dari AuthContext

      setSuccessMsg('Profil berhasil diperbarui!');
      
      // Update form data
      setFormData({
        nama_d: updatedUser.nama_d || '',
        nama_b: updatedUser.nama_b || '',
        kelamin: updatedUser.kelamin || 'Laki-laki',
        lahir: updatedUser.lahir || '',
        alamat: updatedUser.alamat || '',
        phone: updatedUser.phone || '',
        email: updatedUser.email || '',
        uname: updatedUser.uname || '',
        foto: updatedUser.foto || '',
      });

      if (updatedUser.foto) {
        setCurrentFoto(updatedUser.foto);
        setPreview(mediaUrl(updatedUser.foto));
      }

      // Reset password fields
      setPasswordData({
        passwd_lama: '',
        passwd_baru: '',
        passwd_confirm: '',
      });

      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Error:', err);
      setErrorMsg(err.message || 'Terjadi kesalahan pada server');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-muted">Memuat data profil...</div>;
  }

  return (
    <>
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <p className="fw-bold mb-1 fs-3" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Profil Saya</p>
            <p className="text-muted small mb-0">Kelola informasi akun admin Anda.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small mb-4" role="alert">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success py-2 px-3 small mb-4" role="alert">
            {successMsg}
          </div>
        )}

        <div className="card border-0 shadow-sm bg-white p-4 rounded-3">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 text-center mb-3">
                <div className="rounded-circle overflow-hidden border bg-light mx-auto" style={{ width: '120px', height: '120px' }}>
                  <img src={preview || mediaUrl(currentFoto)} alt="Foto Profil" className="w-100 h-100 object-fit-cover" onError={(e) => { e.target.src = '/placeholder-image.jpg';}}
                  />
                </div>
                <div className="mt-2">
                  <label className="btn btn-sm rounded-3 fw-semibold" style={{ color: '#8D7B68', borderColor: '#8D7B68' }}>
                    <i className="bi bi-camera me-1"></i> Ganti Foto
                    <input type="file" className="d-none" accept="image/*" onChange={handleImageChange}/>
                  </label>
                </div>
                <small className="text-muted d-block" style={{ fontSize: '11px' }}>Format: jpg, png, gif, webp (maks 5MB) </small>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor='NamaDepan' className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nama Depan <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="nama_d" value={formData.nama_d} onChange={handleChange}required/>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor='NamaBelakang' className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nama Belakang <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="nama_b" value={formData.nama_b} onChange={handleChange} required />
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor='Kelamin' className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Jenis Kelamin</label>
                <select className="form-select form-select-sm" name="kelamin" value={formData.kelamin} onChange={handleChange}>
                  {KELAMIN.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor='Lahir' className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Tanggal Lahir</label>
                <input type="date" className="form-control form-control-sm" name="lahir" value={formData.lahir} onChange={handleChange} placeholder="Contoh: 1 Jan 1990"/>
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor='Phone' className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Nomor Telepon</label>
                <input type="text" className="form-control form-control-sm" name="phone" value={formData.phone} onChange={handleChange} placeholder="+62xxxxxxxxxx"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Email <span className="text-danger">*</span></label>
                <input type="email" className="form-control form-control-sm" name="email" value={formData.email} onChange={handleChange} required/>
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor='Username' className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Username <span className="text-danger">*</span></label>
                <input type="text" className="form-control form-control-sm" name="uname" value={formData.uname} onChange={handleChange} required/>
              </div>

              <div className="col-12">
                <label htmlFor='Alamat' className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Alamat</label>
                <textarea className="form-control form-control-sm" rows="2" name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Alamat lengkap..."/>
              </div>

              <hr />

              <div className="col-12">
                <p className="fw-bold fs-5 mb-1" style={{ color: '#2A1E17', fontFamily: 'serif' }}>Ubah Password</p>
                <p className="text-muted small">Kosongkan jika tidak ingin mengubah password.</p>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Password Lama</label>
                <input type="password" className="form-control form-control-sm" name="passwd_lama" value={passwordData.passwd_lama} onChange={handlePasswordChange} placeholder="Masukkan password lama"/>
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor='PasswordBaru' className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Password Baru</label>
                <input type="password" className="form-control form-control-sm" name="passwd_baru" value={passwordData.passwd_baru} onChange={handlePasswordChange} placeholder="Minimal 6 karakter"/>
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor='PassswordConfirm' className="form-label fw-semibold small" style={{ color: '#2A1E17' }}>Konfirmasi Password Baru</label>
                <input type="password" className="form-control form-control-sm" name="passwd_confirm" value={passwordData.passwd_confirm} onChange={handlePasswordChange} placeholder="Ulangi password baru"/>
              </div>

              <div className="col-12 d-flex gap-2 pt-2">
                <button type="submit" className="btn btn-sm px-4 fw-semibold text-white border-0 rounded-3 shadow-sm" style={{ backgroundColor: '#D8838B' }} disabled={submitting}>{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}