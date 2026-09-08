// frontend/src/layouts/PublicLayout.jsx
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../constants';
import { mediaUrl } from '../utils';

function IconLocation() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D8838B" viewBox="0 0 16 16">
      <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
    </svg>
  );
}

function IconEmail() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D8838B" viewBox="0 0 16 16">
      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/>
    </svg>
  );
}

function IconPhone() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#D8838B" viewBox="0 0 16 16">
      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.884.511z"/>
    </svg>
  );
}

export default function PublicLayout() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper untuk styling link navigasi aktif
  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#D8838B' : '#2A1E17',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
  });

  return (
    <>
      {/* NAVBAR HEADER */}
      <nav className="navbar shadow-sm px-5" style={{ height: '75px', position: 'sticky', top: '0', backgroundColor: '#FFFFFF', zIndex: 1000 }}>
        <Link to="/">
          <img src={SITE.logo_toko} alt="Logo Ellystitch" style={{ width: '155px', objectFit: 'contain' }}  onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}/>
        </Link>

        <div className="d-flex align-items-center gap-5">
          <NavLink to="/" style={navLinkStyle}>Beranda</NavLink>
          <NavLink to="/toko" style={navLinkStyle}>Toko</NavLink>
          <NavLink to="/artikel" style={navLinkStyle}>Artikel</NavLink>
        </div>

        <div className="d-flex align-items-center">
          {isLoggedIn || user ? (
            <div className="d-flex align-items-center gap-3">
              <Link to="/akun" className="d-flex align-items-center gap-2 text-decoration-none">
                <div className="rounded-circle overflow-hidden border" style={{ width: '38px', height: '38px', borderColor: '#E2959B' }}>
                  <img src={mediaUrl(user?.foto)} alt="Profile" className="w-100 h-100 object-fit-cover" onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}/>
                </div>
                <span className="fw-bold small" style={{ color: '#2A1E17' }}> {user?.nama || user?.username || 'Akun Saya'}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-sm fw-bold px-3 py-2 d-flex align-items-center gap-1 rounded-3" style={{ color: '#D8838B', border: '1px solid #D8838B', backgroundColor: 'transparent' }}>Keluar</button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <NavLink 
                to="/daftar" className="text-decoration-none fw-bold px-3 py-2 rounded-3" style={{ color: '#5C4033', border: '1px solid #5C4033', backgroundColor: 'transparent' }}>Daftar</NavLink>
              <NavLink to="/login" className="text-decoration-none fw-bold px-3 py-2 text-white rounded-3 shadow-sm" style={{ backgroundColor: '#D8838B', border: '1px solid #D8838B' }}>Masuk</NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* RENDER HALAMAN UTAMA */}
      <Outlet />

      {/* FOOTER */}
      <footer className="pt-5 pb-3 mt-auto" style={{ backgroundColor: '#2A1E17', color: '#FAF6F0' }}>
        <div className="container-fluid px-5">
          <div className="row g-4">
            
            {/* Kolom 1: Logo & Deskripsi */}
            <div className="col-md-4">
              <img 
                src={SITE.logo_toko} alt="Logo Ellystitch" style={{ width: '150px', filter: 'brightness(0) invert(1)' }} />
              <p className="fs-6 pt-3 pe-md-4" style={{ color: '#D2C3B5', lineHeight: '1.6' }}>
                {SITE.tentang || "Handmade crochet pieces with love, bringing warmth and aesthetics to your everyday style."}
              </p>
            </div>

            {/* Kolom 2: Navigasi */}
            <div className="col-md-4 text-md-center">
              <p className="text-uppercase fw-bold mb-3 small" style={{ color: '#E2959B', letterSpacing: '1.5px' }}>NAVIGASI</p>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
                <li><Link to="/" className="text-decoration-none" style={{ color: '#D2C3B5' }}>Beranda</Link></li>
                <li><Link to="/toko" className="text-decoration-none" style={{ color: '#D2C3B5' }}>Toko</Link></li>
                <li><Link to="/artikel" className="text-decoration-none" style={{ color: '#D2C3B5' }}>Artikel</Link></li>
              </ul>
            </div>

            {/* Kolom 3: Informasi Kontak */}
            <div className="col-md-4">
              <p className="text-uppercase fw-bold mb-3 small" style={{ color: '#E2959B', letterSpacing: '1.5px' }}>INFORMASI KONTAK</p>
              <div className="d-flex flex-column gap-2" style={{ color: '#D2C3B5' }}>
                <p className="mb-1 d-flex align-items-center gap-2">
                  <IconLocation />
                  <span>{SITE.alamat_toko || "Ponorogo, Jawa Timur, Indonesia"}</span>
                </p>
                <p className="mb-1 d-flex align-items-center gap-2">
                  <IconEmail />
                  <span>{SITE.email_toko || "hello@ellystitch.com"}</span>
                </p>
                <p className="mb-0 d-flex align-items-center gap-2">
                  <IconPhone />
                  <span>{SITE.tlp_toko || "+62 812-3456-7890"}</span>
                </p>
              </div>
            </div>

            <div className="col-12 mt-4">
              <hr style={{ borderColor: '#4A3B32' }} />
              <div className="d-flex justify-content-between align-items-center pt-2">
                <p className="small mb-0" style={{ color: '#A09083' }}> &copy; {new Date().getFullYear()} {SITE.nama_toko || "Ellystitch"}. Seluruh hak cipta dilindungi.</p>
                <p className="small mb-0" style={{ color: '#A09083' }}>Handcrafted with ♡</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}