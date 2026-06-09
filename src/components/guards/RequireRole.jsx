import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RequireRole({ children, allowedRoles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Caso não tenha permissão, pode redirecionar para uma página de "Não autorizado" 
    // ou retornar para a raiz.
    return <Navigate to="/" replace />;
  }

  return children;
}
