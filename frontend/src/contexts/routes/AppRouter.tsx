
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getRoleConfig } from '../../config/roles technical ';
import { useAuth } from '../../contextsLocal/AuthContext';
import Activities from '../../pages/Activities/Activities';
import Agency from '../../pages/Agency/Agency';
import Apprentice from '../../pages/Apprentice/Apprentice';
import Artist from '../../pages/Artist/Artist';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Evaluations from '../../pages/Evaluations/Evaluations';
import Income from '../../pages/Income/Income';
import ListAgency from '../../pages/ListAgency/ListAgency';
import ListApprentice from '../../pages/ListApprentice/ListApprentice';
import ListUsers from '../../pages/ListUsers/ListUsers';
import Login from '../../pages/Login/Login';
import Profile from '../../pages/Profile/Profile';
import Requests from '../../pages/Requests/Requests';
import ProtectedRoute from './ProtectedRoute';

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
    <Route path="/admin/Artist" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Artist />
      </ProtectedRoute>
    } />
    <Route path="/admin/Activities" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Activities />
      </ProtectedRoute>
    } />
    <Route path="/admin/income" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Income />
      </ProtectedRoute>
    } />
    <Route path="/admin/requests" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Requests />
      </ProtectedRoute>
    } />
    <Route path="/admin/profile" element={
      <ProtectedRoute allowedRoles={['admin']}>
        <Profile />
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA DIRECTOR */}
    <Route path="/director/dashboard" element={
      <ProtectedRoute allowedRoles={['director']}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/director/apprentices" element={
      <ProtectedRoute allowedRoles={['director']}>
        <Apprentice />
      </ProtectedRoute>
    } />
    <Route path="/director/listApprentice" element={
      <ProtectedRoute allowedRoles={['director']}>
        <ListApprentice />
      </ProtectedRoute>
    } />
    <Route path="/director/Artist" element={
      <ProtectedRoute allowedRoles={['director']}>
        <Artist />
      </ProtectedRoute>
    } />
    <Route path="/director/Activities" element={
      <ProtectedRoute allowedRoles={['director']}>
        <Activities />
      </ProtectedRoute>
    } />
     <Route path="/director/income" element={
      <ProtectedRoute allowedRoles={['director']}>
        <Income />
      </ProtectedRoute>
    } />
    <Route path="/director/requests" element={
      <ProtectedRoute allowedRoles={['director']}>
        <Requests />
      </ProtectedRoute>
    } />
    <Route path="/director/profile" element={
      <ProtectedRoute allowedRoles={['director']}>
        <Profile />
      </ProtectedRoute>
    } />
    <Route path="/director/listUsers" element={
      <ProtectedRoute allowedRoles={['director']}>
        <ListUsers />
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
    <Route path="/manager/listApprentice" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <ListApprentice />
      </ProtectedRoute>
    } />
    <Route path="/manager/Artist" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <Artist />
      </ProtectedRoute>
    } />
    <Route path="/manager/Activities" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <Activities />
      </ProtectedRoute>
    } />
    <Route path="/manager/income" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <Income />
      </ProtectedRoute>
    } />
    <Route path="/manager/requests" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <Requests />
      </ProtectedRoute>
    } />
    <Route path="/manager/profile" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <Profile />
      </ProtectedRoute>
    } />
    <Route path="/manager/listUsers" element={
      <ProtectedRoute allowedRoles={['manager']}>
        <ListUsers />
      </ProtectedRoute>
    } />

    {/* RUTAS SOLO PARA ARTIST */}
    <Route path="/artist/dashboard" element={
      <ProtectedRoute allowedRoles={['artist']}>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/artist/activities" element={
      <ProtectedRoute allowedRoles={['artist']}>
        <Activities />
      </ProtectedRoute>
    } />
     <Route path="/artist/income" element={
      <ProtectedRoute allowedRoles={['artist']}>
        <Income />
      </ProtectedRoute>
    } />
    <Route path="/artist/requests" element={
      <ProtectedRoute allowedRoles={['artist']}>
        <Requests />
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
    <Route path="/apprentice/evaluations" element={
        <ProtectedRoute allowedRoles={['apprentice']}>
        <Evaluations />
      </ProtectedRoute>
    }/>
    <Route path="/apprentice/requests" element={
      <ProtectedRoute allowedRoles={['apprentice']}>
        <Requests />
      </ProtectedRoute>
    } />
    <Route path="/apprentice/profile" element={
      <ProtectedRoute allowedRoles={['apprentice']}>
        <Profile />
      </ProtectedRoute>
    } />

    {/* RUTA COMODÍN */}
    <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
  </Routes>
);
};

export default AppRouter;