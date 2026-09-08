// frontend/src/components/layout/PembeliLayout.jsx
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../constants';
import { mediaUrl, onImgError } from '../utils';

function IconDashboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-grid-3x3-gap" viewBox="0 0 16 16">
      <path d="M4 2v2H2V2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1M9 2v2H7V2zm5 0v2h-2V2zM4 7v2H2V7zm5 0v2H7V7zm5 0h-2v2h2zM4 12v2H2v-2zm5 0v2H7v-2zm5 0v2h-2v-2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z"/>
    </svg>
  );
}

function IconProduk() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart-plus" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 7.5A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 4l1.25 6.25h8.22l1.25-6.25H3.14zM5.5 13a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.5 1.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zm9.5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.5 1.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0zM8.5 4.5V5h.5a.5.5 0 0 1 0 1h-.5v.5a.5.5 0 0 1-1 0V6h-.5a.5.5 0 0 1 0-1h.5v-.5a.5.5 0 0 1 1 0z"/>
    </svg>
  );
}

function IconPesanan() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bag-check" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M10.854 6.646a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.293l2.646-2.647a.5.5 0 0 1 .708 0z"/>
      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
    </svg>
  );
}

function IconProfil() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
    </svg>
  );
}

function IconBeranda() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
    </svg>
  );
}

function IconKeluar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
      <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
    </svg>
  );
}

export default function PembeliLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // MENU UTAMA PEMBELI - SATU DEKLARASI SAJA
  const menuList = [
    { name: 'Dashboard', path: '/akun', icon: <IconDashboard /> },
    { name: 'Belanja', path: '/akun/belanja', icon: <IconProduk /> },
    { name: 'Pesanan', path: '/akun/pesanan', icon: <IconPesanan /> },
    { name: 'Profil Saya', path: '/akun/profil', icon: <IconProfil /> },
  ];

  const getCurrentPageTitle = () => {
    const currentMenu = menuList.find((item) => {
      if (item.path === '/akun') {
        return location.pathname === '/akun';
      }
      return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
    });
    return currentMenu ? currentMenu.name : 'Dashboard';
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#FAF0E6' }}>
      <aside className="d-flex flex-column justify-content-between p-3 border-end" style={{ width: '260px', backgroundColor: '#ffffff', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', borderColor: '#FAF0E6' }}>
        <div>
          <div className="d-flex align-items-center gap-3 px-2 pt-2 mb-4">
            <i className="bi bi-person-circle fs-2 text-success"></i>
            <div>
              <p className="fw-bold mb-0 text-dark fs-5">Panel Pembeli</p>
              <small className="text-secondary">{SITE.nama_toko}</small>
            </div>
          </div>

          <ul className="nav nav-pills flex-column gap-1">
            {menuList.map((item) => {
              const isActive = (() => {
                if (item.path === '/akun') {
                  return location.pathname === '/akun';
                }
                return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              })();

              return (
                <li key={item.path} className="nav-item">
                  <NavLink to={item.path} className={`nav-link d-flex align-items-center gap-3 px-3 text-decoration-none py-2 rounded-2`} style={{ backgroundColor: isActive ? '#3a5133' : 'transparent', color: isActive ? '#ffffff' : '#b0b0b0', borderLeft: isActive ? '4px solid #e9dac5' : '4px solid transparent', fontWeight: isActive ? '600' : 'normal', transition: 'all 0.2s ease-in-out'}}>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pt-3 border-top border-secondary border-opacity-25">
          <Link to="/" className="d-flex align-items-center gap-3 text-decoration-none px-3 py-2 w-100 rounded-2" style={{ color: '#0d6efd', fontSize: '14px' }}>
            <IconBeranda /><span>Lihat Beranda</span>
            </Link>

          <button onClick={handleLogout} className="btn btn-link d-flex align-items-center gap-3 text-decoration-none px-3 py-2 w-100 text-start" style={{ color: '#dc3545', fontSize: '14px' }}>
            <IconKeluar />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="d-flex flex-column flex-grow-1 vh-100 overflow-hidden">
        <header className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom" style={{ height: '65px', zIndex: 1000 }}>
          <p className="fw-semibold text-dark mb-0 fs-3">{getCurrentPageTitle()}</p>
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle overflow-hidden border" style={{ width: '38px', height: '38px' }}>
              <img src={mediaUrl(user?.foto)} alt="Profile" className="w-100 h-100 object-fit-cover" onError={(e) => { e.target.src = '/placeholder-image.jpg';}}/>
            </div>
            <span className="fw-semibold text-dark small">
              {user?.nama_d || user?.username || 'Pembeli'}
            </span>
          </div>
        </header>

        <main className="p-4 flex-grow-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}