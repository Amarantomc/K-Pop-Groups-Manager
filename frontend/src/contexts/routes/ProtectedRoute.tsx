import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contextsLocal/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, isLoading } = useAuth();

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem'
      }}>
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos, verificar
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // No tiene permiso, redirigir al dashboard por defecto
    return <Navigate to="/dashboard" replace />;
  }

  // Todo bien, mostrar la página
  return <>{children}</>;
};

export default ProtectedRoute;
