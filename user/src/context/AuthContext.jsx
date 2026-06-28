import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { mockProfile } from '../services/mock';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    if (api.isAuthenticated()) {
      api.getProfile()
        .then(d => setUser(d.profile || { email: 'user@rahisisha.co', firstName: 'User' }))
        .catch(() => {
          // Fallback to demo user if API unavailable
          setUser(mockProfile.profile);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await api.login(email, password);
      const data = await api.getProfile();
      setUser(data.profile || { email, firstName: email.split('@')[0] });
      return true;
    } catch (err) {
      // If API is unavailable, simulate login with mock data
      if (err.message.includes('Network error') || err.message.includes('backend unavailable')) {
        api.setToken('demo-token-' + Date.now());
        setUser(mockProfile.profile);
        return true;
      }
      throw err;
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      await api.register(data);
      return true;
    } catch (err) {
      if (err.message.includes('Network error') || err.message.includes('backend unavailable')) {
        return true; // simulate success
      }
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
  }, []);

  const value = { user, loading, login, register, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}