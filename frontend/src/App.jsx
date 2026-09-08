/**
 * App.jsx — AuthProvider + Router + daftar Route.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './components/RequireAuth';
import AdminLayout from './layouts/AdminLayout';
import PembeliLayout from './layouts/PembeliLayout';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import TokoPage from './pages/TokoPage';
import ArtikelListPage from './pages/ArtikelListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ArtikelDetailPage from './pages/ArtikelDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PembeliOverviewPage from './pages/pembeli/PembeliOverviewPage';
import PembeliBelanjaPage from './pages/pembeli/PembeliBelanjaPage';
import PembeliPesananPage from './pages/pembeli/PembeliPesananPage';
import PembeliProfilPage from './pages/pembeli/PembeliProfilPage';
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import AdminProdukPage from './pages/admin/AdminProdukPage';
import AdminPembeliPage from './pages/admin/AdminPembeliPage';
import AdminPembelianPage from './pages/admin/AdminPembelianPage';
import AdminArtikelPage from './pages/admin/AdminArtikelPage';
import AdminProfilPage from './pages/admin/AdminProfilPage';
import AdminTambahProdukPage from './pages/admin/AdminTambahProdukPage';
import AdminEditProdukPage from './pages/admin/AdminEditProdukPage';
import AdminDetailProdukPage from './pages/admin/AdminDetailProdukPage';
import AdminTambahPembeliPage from './pages/admin/AdminTambahPembeliPage';
import AdminEditPembeliPage from './pages/admin/AdminEditPembeliPage';
import AdminTambahArtikelPage from './pages/admin/AdminTambahArtikelPage';
import AdminEditArtikelPage from './pages/admin/AdminEditArtikelPage';
import AdminDetailPembeliPage from './pages/admin/AdminDetailPembeliPage';

export default function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/toko" element={<TokoPage />} />
            <Route path="/artikel" element={<ArtikelListPage />} />
            <Route path="/produk/:id" element={<ProductDetailPage />} />
            <Route path="/artikel/:id" element={<ArtikelDetailPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/daftar" element={<RegisterPage />} />

          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="produk" element={<AdminProdukPage />} />
            <Route path="pembeli" element={<AdminPembeliPage />} />
            <Route path="pembelian" element={<AdminPembelianPage />} />
            <Route path="artikel" element={<AdminArtikelPage />} />
            <Route path="profil" element={<AdminProfilPage />} />
            <Route path="produk/tambah" element={<AdminTambahProdukPage />} />
            <Route path="produk/edit/:id" element={<AdminEditProdukPage />} />
            <Route path="produk/detail/:id" element={<AdminDetailProdukPage />} />
            <Route path="pembeli/tambah" element={<AdminTambahPembeliPage />} />
            <Route path='pembeli/edit/:id' element={<AdminEditPembeliPage />} />
            <Route path="pembeli/:id" element={<AdminDetailPembeliPage />} />
            <Route path='artikel/tambah' element={<AdminTambahArtikelPage />} />
            <Route path='artikel/edit/:id' element={<AdminEditArtikelPage />} />
          </Route>

          <Route
            path="/akun"
            element={
              <RequireAuth role="pembeli">
                <PembeliLayout />
              </RequireAuth>
            }
          >
            <Route index element={<PembeliOverviewPage />} />
            <Route path="belanja" element={<PembeliBelanjaPage />} />
            <Route path="pesanan" element={<PembeliPesananPage />} />
            <Route path="profil" element={<PembeliProfilPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </AuthProvider>
  );
}
