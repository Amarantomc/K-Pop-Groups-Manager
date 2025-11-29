
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contextsLocal/AuthContext';
import Login from '../../pages/Login/Login';
import Dashboard from '../../pages/Admin/AdminDashboard';
import Agency from '../../pages/Admin/Agency/Agency';
import ListAgency from '../../pages/Admin/ListAgency/ListAgency';
import ListApprentice from '../../pages/common/ListApprentice/ListApprentice';
import Apprentice from '../../pages/common/Apprentice/Apprentice';
import ListUsers from '../../pages/Admin/ListUsers/ListUsers';
import Profile from '../../pages/common/Profile/Profile';
import ProtectedRoute from './ProtectedRoute';
import { getRoleConfig } from '../../config/roles technical ';

const AppRouter: React.FC = () => {
  const { user, isLoading } = useAuth();

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
return (
  <Routes>
    {/* RUTA PÚBLICA */}
    <Route
      path="/login"
      element={!user ? <Login /> : <Navigate to={getRoleConfig(user.role).defaultRedirect} replace />}
    />

    {/* RUTA RAÍZ - REDIRIGE SEGÚN ROL */}
    <Route
      path="/"
      element={
        user ? (
          <Navigate to={getRoleConfig(user.role).defaultRedirect} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />

    {/* RUTAS SOLO PARA ADMIN */}
    <Route path="/dashboard" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/admin/dashboard" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/agency" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Agency />
      </ProtectedRoute>
    } />
    <Route path="/listAgency" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <ListAgency />
      </ProtectedRoute>
    } />
    <Route path="/listUsers" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <ListUsers />
      </ProtectedRoute>
    } />
    <Route path="/apprentices" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Apprentice />
      </ProtectedRoute>
    } />
    <Route path="/listApprentice" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <ListApprentice />
      </ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Profile />
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA MANAGER */}
    <Route path="/manager/dashboard" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <div>Manager Dashboard</div>
      </ProtectedRoute>
    } />
    <Route path="/manager/apprentices" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <ListApprentice />
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA ARTIST */}
    <Route path="/artist/dashboard" element={
      <ProtectedRoute allowedRoles={['artist']}>
        <div>Artist Dashboard</div>
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA APPRENTICE */}
    <Route path="/apprentice/dashboard" element={
      <ProtectedRoute allowedRoles={['apprentice']}>
        <div>Apprentice Dashboard</div>
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA DIRECTOR */}
    <Route path="/director/dashboard" element={
      <ProtectedRoute allowedRoles={['director']}>
        <div>Director Dashboard</div>
      </ProtectedRoute>
    } />

    {/* RUTA COMODÍN */}
    <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
  </Routes>
);
};

export default AppRouter;