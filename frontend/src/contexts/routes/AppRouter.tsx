import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { getRoleConfig } from '../../config/roles technical ';
import { useAuth } from '../auth/AuthContext';
import Activities from '../../pages/Activities/Activities';
import Albums from '../../pages/Albums/Albums';
import Artist from '../../pages/Artist/Artist';
import Contracts from '../../pages/Contracts/Contracts';
import Dashboard from '../../pages/Dashboard/Dashboard';
import Evaluations from '../../pages/Evaluations/Evaluations';
import Groups from '../../pages/Groups/Groups';
import Income from '../../pages/Income/Income';
import Agency from '../../pages/Agency/Agency';
import Apprentice from '../../pages/Apprentice/Apprentice';
import Users from '../../pages/Users/Users';
import Login from '../../pages/Login/Login';
import Profile from '../../pages/Profile/Profile';
import Requests from '../../pages/Requests/Requests';
import ProtectedRoute from './ProtectedRoute';
import Overview from '../../pages/ExampleUsage/ExampleUsage';
import Award from '../../pages/Award/Award';
import Concept from '../../pages/Concept/Concept';
import ConceptVisual from '../../pages/ConceptVisual/ConceptVisual';
import PopularityLists from '../../pages/PopularityLists/PopularityLists';
import Songs from '../../pages/Songs/Songs';
import Queries from '../../pages/Queries/Queries';

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
        /* RUTA DE EJEMPLO ADICIONAL PARA ADMIN */
      <Route path="/admin/overview" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Overview />
        </ProtectedRoute>
      } />
      <Route path="/admin/agency" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Agency />
        </ProtectedRoute>
      } />
      <Route path="/admin/apprentice" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Apprentice />
        </ProtectedRoute>
      } />
      <Route path="/admin/artists" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Artist />
        </ProtectedRoute>
      } />
      <Route path="/admin/groups" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Groups />
        </ProtectedRoute>
      } />
      <Route path="/admin/concept" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Concept />
        </ProtectedRoute>
      } />
      <Route path="/admin/concept-visual" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <ConceptVisual />
        </ProtectedRoute>
      } />
      <Route path="/admin/albums" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Albums />
        </ProtectedRoute>
      } />
      <Route path="/admin/songs" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Songs />
        </ProtectedRoute>
      } />
      <Route path="/admin/award" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Award />
        </ProtectedRoute>
      } />
      <Route path="/admin/popularity-lists" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <PopularityLists />
        </ProtectedRoute>
      } />
      <Route path="/admin/activities" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Activities />
        </ProtectedRoute>
      } />
      <Route path="/admin/contracts" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Contracts />
        </ProtectedRoute>
      } />
      <Route path="/admin/income" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Income />
        </ProtectedRoute>
      } />
      <Route path="/admin/request" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Requests />
        </ProtectedRoute>
      } />
      <Route path="/admin/profile" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/admin/queries" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Queries />
        </ProtectedRoute>
      } />

      {/* RUTAS SOLO PARA DIRECTOR */}
      <Route path="/director/dashboard" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/director/apprentice" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Apprentice />
        </ProtectedRoute>
      } />
      <Route path="/director/artists" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Artist />
        </ProtectedRoute>
      } />
      <Route path="/director/group" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Groups />
        </ProtectedRoute>
      } />
      <Route path="/director/concept" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Concept />
        </ProtectedRoute>
      } />
      <Route path="/director/concept-visual" element={
        <ProtectedRoute allowedRoles={['director']}>
          <ConceptVisual />
        </ProtectedRoute>
      } />
      <Route path="/director/albums" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Albums />
        </ProtectedRoute>
      } />
      <Route path="/director/songs" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Songs />
        </ProtectedRoute>
      } />
      <Route path="/director/award" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Award />
        </ProtectedRoute>
      } />
      <Route path="/director/popularity-lists" element={
        <ProtectedRoute allowedRoles={['director']}>
          <PopularityLists />
        </ProtectedRoute>
      } />
      <Route path="/director/activities" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Activities />
        </ProtectedRoute>
      } />
      <Route path="/director/contracts" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Contracts />
        </ProtectedRoute>
      } />
      <Route path="/director/income" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Income />
        </ProtectedRoute>
      } />
      <Route path="/director/request" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Requests />
        </ProtectedRoute>
      } />
      <Route path="/director/profile" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/director/queries" element={
        <ProtectedRoute allowedRoles={['director']}>
          <Queries />
        </ProtectedRoute>
      } />

      {/* RUTAS SOLO PARA MANAGER */}
      <Route path="/manager/dashboard" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/manager/apprentice" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Apprentice />
        </ProtectedRoute>
      } />
      <Route path="/manager/artists" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Artist />
        </ProtectedRoute>
      } />
      {/*<Route path="/manager/artists-active" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <ArtistActive />
        </ProtectedRoute>
      } />*/}
      <Route path="/manager/group" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Groups />
        </ProtectedRoute>
      } />
      <Route path="/manager/concept" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Concept />
        </ProtectedRoute>
      } />
      <Route path="/manager/concept-visual" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <ConceptVisual />
        </ProtectedRoute>
      } />
      <Route path="/manager/albums" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Albums />
        </ProtectedRoute>
      } />
      <Route path="/manager/songs" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Songs />
        </ProtectedRoute>
      } />
      <Route path="/manager/activities" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Activities />
        </ProtectedRoute>
      } />
      <Route path="/manager/award" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Award />
        </ProtectedRoute>
      } />
      <Route path="/manager/popularity-lists" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <PopularityLists />
        </ProtectedRoute>
      } />
      <Route path="/manager/contracts" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Contracts />
        </ProtectedRoute>
      } />
      <Route path="/manager/income" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Income />
        </ProtectedRoute>
      } />
      <Route path="/manager/request" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Requests />
        </ProtectedRoute>
      } />
      <Route path="/manager/profile" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/manager/queries" element={
        <ProtectedRoute allowedRoles={['manager']}>
          <Queries />
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
      <Route path="/artist/albums" element={
        <ProtectedRoute allowedRoles={['artist']}>
          <Albums />
        </ProtectedRoute>
      } />
      <Route path="/artist/songs" element={
        <ProtectedRoute allowedRoles={['artist']}>
          <Songs />
        </ProtectedRoute>
      } />
      <Route path="/artist/award" element={
        <ProtectedRoute allowedRoles={['artist']}>
          <Award />
        </ProtectedRoute>
      } />
      <Route path="/artist/popularity-lists" element={
        <ProtectedRoute allowedRoles={['artist']}>
          <PopularityLists />
        </ProtectedRoute>
      } />
      <Route path="/artist/request" element={
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
      } />
      <Route path="/apprentice/request" element={
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