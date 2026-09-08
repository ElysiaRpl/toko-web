// frontend/src/components/RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Komponen untuk melindungi route yang membutuhkan autentikasi dan role tertentu.
 * 
 * @param {Object} props
 * @param {string|string[]} props.role - Role yang diizinkan (admin / pembeli)
 * @param {React.ReactNode} props.children - Komponen yang akan di-render jika diizinkan
 * 
 * Contoh penggunaan:
 * <RequireAuth role="admin">
 *   <AdminLayout />
 * </RequireAuth>
 * 
 * <RequireAuth role={["admin", "pembeli"]}>
 *   <DashboardLayout />
 * </RequireAuth>
 */
export default function RequireAuth({ role, children }) {
  const { user, loading, isLoggedIn } = useAuth();
  const location = useLocation();

  // Jika masih loading, tampilkan spinner (atau null)
  if (loading) {
    return null; // atau <LoadingSpinner />
  }

  // Jika belum login, redirect ke login
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Jika role tidak sesuai, redirect ke halaman sesuai role
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    
    if (!roles.includes(user?.role)) {
      // Jika user adalah admin, redirect ke admin dashboard
      if (user?.role === 'admin') {
        return <Navigate to="/admin" replace />;
      }
      // Jika user adalah pembeli, redirect ke dashboard pembeli
      if (user?.role === 'pembeli') {
        return <Navigate to="/akun" replace />;
      }
      // Fallback ke beranda
      return <Navigate to="/" replace />;
    }
  }

  // Jika semua lolos, render children
  return children;
}