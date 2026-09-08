// frontend/src/components/layout/AdminLayout.jsx
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SITE } from '../constants';
import { mediaUrl } from '../utils'; 

function IconDashboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-grid-3x3-gap" viewBox="0 0 16 16">
      <path d="M4 2v2H2V2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1M9 2v2H7V2zm5 0v2h-2V2zM4 7v2H2V7zm5 0v2H7V7zm5 0h-2v2h2zM4 12v2H2v-2zm5 0v2H7v-2zm5 0v2h-2v-2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z"/>
    </svg>
  );
}

function IconProduk() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-box-seam" viewBox="0 0 16 16">
      <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
    </svg>
  );
}

function IconPembeli() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
    </svg>
  );
}

function IconPesanan() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
    </svg>
  );
}

function IconArtikel() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
      <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
      <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
    </svg>
  );
}

function IconProfil() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
    </svg>
  );
}

function IconBeranda() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
    </svg>
  );
}

function IconKeluar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
      <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
    </svg>
  );
}

// --- 2. ARRAY MENU UTAMA ---
const menuList = [
  { name: 'Dashboard', path: '/admin', icon: <IconDashboard /> },
  { name: 'Produk', path: '/admin/produk', icon: <IconProduk /> },
  { name: 'Pembeli', path: '/admin/pembeli', icon: <IconPembeli /> },
  { name: 'Pesanan', path: '/admin/pembelian', icon: <IconPesanan /> },
  { name: 'Artikel', path: '/admin/artikel', icon: <IconArtikel /> },
  { name: 'Profil Saya', path: '/admin/profil', icon: <IconProfil /> },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const checkIsActive = (itemPath) => {
    if (itemPath === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === itemPath || location.pathname.startsWith(`${itemPath}/`);
  };

  const getCurrentPageTitle = () => {
    const currentMenu = menuList.find((item) => checkIsActive(item.path));
    return currentMenu ? currentMenu.name : 'Dashboard';
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#FAF0E6' }}>
      <aside className="d-flex flex-column justify-content-between p-3 border-end" style={{ width: '260px', backgroundColor: '#ffffff', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', borderColor: '#FAF0E6' }}>
        <div>
          <div className="d-flex align-items-center gap-3 px-2 pt-2 mb-4">
            <i className="bi bi-truck fs-3 text-success"></i>
            <div>
              <p className="fw-bold mb-0 text-muted fs-5">Panel Admin</p>
              <small className="text-secondary">{SITE?.nama_toko || 'Toko Saya'}</small>
            </div>
          </div>

          <ul className="nav nav-pills flex-column gap-1">
            {menuList.map((item) => {
              const isActive = checkIsActive(item.path);

              return (
                <li key={item.path} className="nav-item">
                  <NavLink to={item.path} className="nav-link d-flex align-items-center gap-3 px-3 text-decoration-none py-2 rounded-2" style={{backgroundColor: isActive ? '#3a5133' : 'transparent', color: isActive ? '#ffffff' : '#6c757d', borderLeft: isActive ? '4px solid #e9dac5' : '4px solid transparent', fontWeight: isActive ? '600' : 'normal', transition: 'all 0.2s ease-in-out'}}>
                    <span className="d-inline-flex align-items-center">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="pt-3 border-top border-secondary border-opacity-25">
          <Link to="/" target="_blank" className="btn btn-link d-flex align-items-center gap-2 text-decoration-none px-3 py-1 w-100 text-start" style={{ color: '#3a5133', fontSize: '14px' }}>
            <i className="bi bi-house-door"></i>
            <span><span className='me-2'><IconBeranda /></span>Lihat Beranda</span>
          </Link>
          
          <button onClick={handleLogout} className="btn btn-link d-flex align-items-center gap-2 text-decoration-none px-3 py-1 w-100 text-start text-danger" style={{ fontSize: '14px' }}>
            <i className="bi bi-box-arrow-right"></i>
            <span><span className='me-2'><IconKeluar /></span>Keluar</span>
          </button>
        </div>
      </aside>

      <div className="d-flex flex-column flex-grow-1 vh-100 overflow-hidden">
        <header className="d-flex align-items-center justify-content-between px-4 py-3 bg-white border-bottom"style={{ height: '65px', zIndex: 1000}}>
          <p className="fw-semibold text-dark mb-0 fs-3">{getCurrentPageTitle()}</p>

          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle overflow-hidden border" style={{ width: '38px', height: '38px' }}>
              <img src={mediaUrl(user?.foto)} alt="Profile" className="w-100 h-100 object-fit-cover" onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}/>
            </div>
            <span className="fw-semibold text-dark small">
              {user?.nama || user?.username || 'Admin Toko'}
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