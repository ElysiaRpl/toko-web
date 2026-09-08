// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { getToken, getRole, saveSession, clearSession, isLoggedIn } from '../utils';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cek session saat pertama kali load
  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoggedIn()) {
        setLoading(false);
        return;
      }

      try {
        const token = getToken();
        const role = getRole();
        
        // Ambil data user berdasarkan role
        let userData;
        if (role === 'admin') {
          const res = await api.getAdminMe();
          userData = res.data;
        } else {
          const res = await api.getPembeliMe();
          userData = res.data;
        }
        
        setUser({ ...userData, role });
      } catch (error) {
        // Token expired atau invalid
        clearSession();
        setUser(null);
        console.error('Auth check failed:', error.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = useCallback(async (credential, passwd) => {
    try {
      const res = await api.login(credential, passwd);
      const { token, user: userData } = res;
      
      // Simpan session
      saveSession(token, userData.role);
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  // Register
  const register = useCallback(async (payload) => {
    try {
      const res = await api.register(payload);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Update user (setelah update profile)
  const updateUser = useCallback((newData) => {
  setUser((prev) => {
    const updated = { ...prev, ...newData };
    // Update localStorage juga
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  });
}, []);

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    isPembeli: user?.role === 'pembeli',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}

export default AuthContext;