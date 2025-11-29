
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contextsLocal/AuthContext';
import Login from '../../pages/Login/Login';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Agency from '../../pages/Agency/Agency';
import ListAgency from '../../pages/ListAgency/ListAgency';
import ListApprentice from '../../pages/ListApprentice/ListApprentice';
import Apprentice from '../../pages/Apprentice/Apprentice';
import ListUsers from '../../pages/ListUsers/ListUsers';
import Profile from '../../pages/Profile/Profile';
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
    <Route path="/admin/dashboard" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/admin/agency" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Agency />
      </ProtectedRoute>
    } />
    <Route path="/admin/listAgency" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <ListAgency />
      </ProtectedRoute>
    } />
    <Route path="/admin/listUsers" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <ListUsers />
      </ProtectedRoute>
    } />
    <Route path="/admin/apprentices" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Apprentice />
      </ProtectedRoute>
    } />
    <Route path="/admin/listApprentice" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <ListApprentice />
      </ProtectedRoute>
    } />
    <Route path="/admin/profile" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Profile />
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA MANAGER */}
    <Route path="/manager/dashboard" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/manager/apprentices" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <ListApprentice />
      </ProtectedRoute>
    } />
    <Route path="/manager/profile" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <Profile />
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA ARTIST */}
    <Route path="/artist/dashboard" element={
      <ProtectedRoute allowedRoles={['artist']}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/artist/profile" element={
      <ProtectedRoute allowedRoles={['artist']}>
        <Profile />
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA APPRENTICE */}
    <Route path="/apprentice/dashboard" element={
      <ProtectedRoute allowedRoles={['apprentice']}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/apprentice/profile" element={
      <ProtectedRoute allowedRoles={['apprentice']}>
        <Profile />
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA DIRECTOR */}
    <Route path="/director/dashboard" element={
      <ProtectedRoute allowedRoles={['director']}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/director/profile" element={
      <ProtectedRoute allowedRoles={['director']}>
        <Profile />
      </ProtectedRoute>
    } />

    {/* RUTA COMODÍN */}
    <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
  </Routes>
);
};

export default AppRouter;