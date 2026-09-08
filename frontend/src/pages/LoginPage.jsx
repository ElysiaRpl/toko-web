// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../constants';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/akun';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        const pendingId = localStorage.getItem('pending_checkout_product');

        if (result.user?.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (result.user?.role === 'pembeli') {
          if (pendingId) {
            navigate('/akun/belanja', { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        } else {
          navigate('/', { replace: true });
        }
      } else {
        setError(result.message || 'Login gagal, periksa email dan password');
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className='container-fluid vh-100' style={{ backgroundColor: '#F8F6F0', padding: '40px 0' }}>
        <div className='row justify-content-center'>
          <div className="col-4 border"  style={{ borderRadius: '20px', backgroundColor: '#ffffff', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', height:'500px'}}>
            <img src={SITE.logo_toko} alt='logo' className='d-block mx-auto mt-5' style={{width:'200px'}}  onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
            <p className="text-center mt-2 mb-4 fw-medium" style={{ color: '#8D7B68' }}>Selamat datang kembali di Ellystitch</p>
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show mx-3" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError("")}></button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mx-3">
              <div className="mb-3">
                <label htmlFor='Email' className="text-muted fw-semibold mb-2">Email Address</label>
                <input  type="email"  name="email" className="form-control bg-transparent text-dark" style={{ borderColor: '#E5D9D0' }} placeholder="Masukkan Email"  value={email} onChange={(e) => setEmail(e.target.value)}  required  disabled={loading}/>
              </div>

              <div className="mb-3">
                <label htmlFor="Password" className="text-muted fw-semibold mb-2">Password</label>
                <input type="password"  name="password" className="form-control bg-transparent text-dark" style={{ borderColor: '#E5D9D0' }} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
              </div>

              <button type="submit" name="login" className="btn form-control fw-bold text-white my-3 rounded-3 border-0 shadow-sm" style={{ backgroundColor: '#D8838B' }} disabled={loading}> {loading ? "Memproses..." : "Masuk"}</button>

              <div className="text-center">
                <Link to="/" className="fw-semibold text-decoration-none small" style={{ color: '#2A1E17' }}> ← Kembali ke Beranda </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}