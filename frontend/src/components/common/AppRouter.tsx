
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../../pages/Login/Login';
import Dashboard from '../../pages/dashboard/Dashboard';
import Agency from '../../pages/Agency/Agency';
import ListAgency from '../../pages/ListAgency/ListAgency';
import ListApprentice from '../../pages/ListApprentice/ListApprentice';
import ListUsers from '../../pages/ListUsers/ListUsers';
import Profile from '../../pages/Profile/Profile';

const AppRouter: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
      />

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/agency"
        element={user ? <Agency /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/listAgency"
        element={user ? <ListAgency /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/listApprentice"
        element={user ? <ListApprentice /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/listUsers"
        element={user ? <ListUsers /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />

      {/* Ruta comodín: redirige al dashboard si hay usuario, si no al login */}
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
      />
    </Routes>
  );
};

export default AppRouter;