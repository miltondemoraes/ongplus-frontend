import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RequireGuest({ children }) {
  const { user } = useAuth();

  if (user) {
    // Redireciona o usuário para sua respectiva área se já estiver logado
    if (user.role === 'donor') return <Navigate to="/donor-profile" replace />;
    if (user.role === 'ong') return <Navigate to="/gestao-ong" replace />;
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
