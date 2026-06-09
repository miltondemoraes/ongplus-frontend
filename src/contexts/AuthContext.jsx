import { createContext, useContext, useState, useEffect } from 'react';
import { apiPost, apiGet, apiPatch } from '../services/apiClient';

const AuthContext = createContext(undefined);

function normalizeUser(userData) {
  if (!userData) return null;
  return {
    id: userData.id,
    name: userData.full_name || userData.name || '',
    email: userData.email || '',
    role: userData.role || 'visitor',
    joinedAt: userData.date_joined || userData.joinedAt || null,
    ngoId: userData.ngo_profile?.id || userData.ngoProfile?.id || null,
    ngoName: userData.ngo_profile?.name || userData.ngoProfile?.name || null,
    donorProfile: userData.donor_profile || userData.donorProfile || null,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca usuário se houver token
    const token = localStorage.getItem('@ongplus:token');
    if (token) {
      apiGet('/v1/auth/me/')
        .then((userData) => {
           const normalized = normalizeUser(userData);
           setUser(normalized);
           localStorage.setItem('@ongplus:user', JSON.stringify(normalized));
        })
        .catch(() => {
           setUser(null);
           localStorage.removeItem('@ongplus:token');
           localStorage.removeItem('@ongplus:refresh_token');
           localStorage.removeItem('@ongplus:user');
        })
        .finally(() => {
           setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const data = await apiPost('/v1/auth/login/', credentials);
    const { access, refresh } = data;
    localStorage.setItem('@ongplus:token', access);
    localStorage.setItem('@ongplus:refresh_token', refresh);

    const me = await apiGet('/v1/auth/me/');
    const userData = normalizeUser(me);
    setUser(userData);
    localStorage.setItem('@ongplus:user', JSON.stringify(userData));
    return userData;
  };

  const updateUser = async (updates) => {
    const payload = {};
    if (updates.name !== undefined) payload.full_name = updates.name;
    if (updates.email !== undefined) payload.email = updates.email;

    const me = await apiPatch('/v1/auth/me/', payload);
    const userData = normalizeUser(me);
    setUser(userData);
    localStorage.setItem('@ongplus:user', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    try {
      const refresh = localStorage.getItem('@ongplus:refresh_token');
      if (refresh) {
         await apiPost('/v1/auth/logout/', { refresh });
      }
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      setUser(null);
      localStorage.removeItem('@ongplus:token');
      localStorage.removeItem('@ongplus:refresh_token');
      localStorage.removeItem('@ongplus:user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
