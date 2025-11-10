import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
// import NavBar from '../../components/navbar/Navbar';
import '../../styles/profile.css';
import Form from '../../components/form/Form';
import formFieldsByEntity from '../../formSource';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  // Normalizar campos (solo los que usamos: name, email, rol)
  const u: any = user as any;
  const displayName = u?.name ?? 'Usuario';
  const displayRole = u?.rol ?? u?.role ?? '-';
  const [showUserForm, setShowUserForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleSubmit = (data: FormData | Record<string, any>) => {
    // Envío real al backend: POST http://localhost:3000/api/user/
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else {
      Object.assign(payload, data);
    }

    (async () => {
      try {
  // aqui va el endpoint
  try { console.log('Creando usuario - payload:', payload); } catch(e) {}

        // Compatibilidad: si backend espera 'name' en lugar de 'username', rellenarlo desde username
        if (!payload.name && payload.username) {
          payload.name = payload.username;
        }
  const res = await fetch(`${API_BASE}/api/user/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          // intentar leer JSON o texto crudo para dar feedback útil
          let msg = 'Error al crear usuario';
          try {
            const txt = await res.text();
            try { const j = JSON.parse(txt); msg = j?.message || j?.error || txt || msg; }
            catch { msg = txt || msg; }
          } catch(e) {}
          alert(msg);
          return;
        }

  await res.json().catch(() => null);
  alert('Usuario creado correctamente');
        setShowUserForm(false);
      } catch (err) {
        console.error('Error creando usuario:', err);
        alert(err instanceof Error ? err.message : 'Error de red');
      }
    })();
  };

  return (
    <div className="Profile-sidebar">
      <Sidebar />
      <div className="Profile-navbar">
        {/* <NavBar /> */}

        <div className="Profile-content">
          <div className='welcome-card'>
            <div className='welcome-text'>
              <h1>Perfil</h1>
              <p className='hint'>Información y ajustes de tu cuenta</p>
            </div>
          </div>

          {/* Mostrar datos del usuario logueado en tarjeta principal */}
          <div className="profile-container" style={{ marginTop: 12 }}>
            {user ? (
              <div className="profile-card" style={{ position: 'relative' }}>
                <div className="profile-top" style={{ alignItems: 'center', display: 'flex' }}>
                  {/* Avatar: si el usuario tiene avatarUrl, mostrar imagen, si no, inicial */}
                  <img
                    src={user.avatarUrl ?? '/avatar-placeholder.svg'}
                    alt={user.name ?? 'Avatar'}
                    className="profile-avatar-img"
                  />

                  {/* Meta principal: nombre, email y rol */}
                  <div className="profile-meta">
                    <h2>{displayName}</h2>
                    <p className="meta-line"><strong>Email:</strong> {u?.email ?? '-'}</p>
                    <p className="meta-line"><strong>Rol:</strong> {displayRole}</p>
                    <div className="profile-actions">
                      <button className="btn btn-primary" onClick={() => { setShowEditForm(true); setShowPasswordForm(false); setShowUserForm(false); }}>
                        Editar perfil
                      </button>
                      <button className="btn btn-primary" onClick={() => { setShowPasswordForm(true); setShowEditForm(false); setShowUserForm(false); }}>
                        Cambiar contraseña
                      </button>
                    </div>
                    {/* Botón rojo para eliminar perfil dentro del recuadro (esquina inferior derecha) */}
                    <button
                      onClick={async () => {
                        if (!window.confirm('¿Estás seguro de eliminar tu perfil? Esta acción no se puede deshacer.')) return;
                        const API_BASE = 'http://localhost:3000';
                        try {
                          const token = localStorage.getItem('token');
                          const uid = user?.id;
                          const res = await fetch(`${API_BASE}/api/user/${uid}`, {
                            method: 'DELETE',
                            headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
                          });
                          if (!res.ok) {
                            const raw = await res.text().catch(() => '');
                            let msg = 'Error al eliminar perfil';
                            try { const j = JSON.parse(raw); msg = j?.message || j?.error || raw || msg; } catch(e) { msg = raw || msg; }
                            alert(msg);
                            return;
                          }
                          alert('Perfil eliminado correctamente');
                          try { localStorage.removeItem('token'); localStorage.removeItem('user'); } catch(e){}
                          if (logout && typeof logout === 'function') logout();
                          navigate('/login', { replace: true });
                        } catch (err) {
                          console.error('Error eliminando perfil:', err);
                          alert(err instanceof Error ? err.message : 'Error de red');
                        }
                      }}
                      style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 1100, background: '#d32f2f', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: 6, cursor: 'pointer' }}
                      className="btn-delete-profile"
                    >
                      Eliminar perfil
                    </button>
                  </div>

                  {/* ID en la esquina superior derecha del header (alineado a la derecha dentro del flex) */}
                  <div className="profile-id-top">{user.id ?? '-'}</div>
                </div>
              </div>
            ) : (
              <div className="profile-card">
                <p>No hay usuario autenticado</p>
              </div>
            )}
          </div>

          {/* Contenedor con los dos botones solicitados debajo del header/tarjeta */}
          <div className="profile-button-row" style={{ marginTop: 18 }}>
            <button className="primary-btn" onClick={() => { setShowUserForm(!showUserForm); setShowEditForm(false); setShowPasswordForm(false); }}>
              Añadir usuario
            </button>
          </div>

          {showUserForm && (
            <div className="Profile-form">
              <div className="form-center">
                <Form fields={formFieldsByEntity['user']} entity="Usuario" onSubmit={handleSubmit} />
              </div>
            </div>
          )}

          {/* Formulario de edición del perfil (prefill con datos del login) */}
          {showEditForm && user && (
            <div className="Profile-form">
              <div className="form-center">
                <Form
                  fields={formFieldsByEntity['user'].filter(f => f.name !== 'password')}
                  entity="Usuario"
                  mode="edit"
                  // El formulario espera el campo 'name' (no 'username') y 'rol' para el select
                  initialValues={{ name: u?.name, email: u?.email, rol: u?.rol ?? u?.role ?? '' }}
                  submitLabel="Actualizar perfil"
                  onSubmit={(data) => {
                    // Enviar actualización del perfil al backend
                    const payload: Record<string, any> = {};
                    if (data instanceof FormData) {
                      data.forEach((v, k) => { payload[k] = v; });
                    } else Object.assign(payload, data);

                    // Asegurar que el payload incluya todas las claves que se usan en creación de usuario
                    const userFields = formFieldsByEntity['user'] || [];
                    userFields.forEach((f) => {
                      if (!(f.name in payload)) {
                        payload[f.name] = (u && (u[f.name] !== undefined && u[f.name] !== null)) ? u[f.name] : '';
                      }
                    });

                    // Si el formulario incluye nuevas contraseñas, validarlas y mapear al campo 'password'
                    if ('newPassword' in payload || 'confirmPassword' in payload) {
                      if (payload.newPassword !== payload.confirmPassword) {
                        alert('La nueva contraseña y la confirmación no coinciden');
                        return;
                      }
                      if (payload.newPassword) {
                        payload.password = payload.newPassword;
                      }
                      delete payload.newPassword;
                      delete payload.confirmPassword;
                    }

                    (async () => {
                      const API_BASE = 'http://localhost:3000';
                      try {
                        const token = localStorage.getItem('token');
                        if (!token) {
                          alert('No autenticado. Por favor inicia sesión de nuevo.');
                          return;
                        }
                        const headers: Record<string, string> = {};
                        let body: any;
                        if (data instanceof FormData) {
                          // enviar FormData directamente (para incluir archivos)
                          body = data as FormData;
                        } else {
                          headers['Content-Type'] = 'application/json';
                          body = JSON.stringify(payload);
                        }
                        if (token) headers['Authorization'] = `Bearer ${token}`;

                        // aqui va el endpoint
                        // Intentar PATCH; si el servidor no soporta PATCH, probar PUT y varias rutas alternativas (con y sin id)
                        // Usamos directamente PUT a la ruta principal; la función tryEndpoints se elimina porque no se utiliza.
                        
                        // Según tu backend: actualizar usuario en PUT /api/user/:id
                        const primaryUrl = `${API_BASE}/api/user/${user.id}`;
                        const res = await fetch(primaryUrl, {
                          method: 'PUT',
                          headers: Object.keys(headers).length ? headers : undefined,
                          body,
                        });

                        if (!res.ok) {
                          const raw = await res.text().catch(() => '');
                          if (import.meta.env.MODE === 'development') {
                            // eslint-disable-next-line no-console
                            console.debug('[Profile] PUT /api/user/:', res.status, res.statusText, raw);
                          }
                          let msg = 'Error al actualizar perfil';
                          try { const j = JSON.parse(raw); msg = j?.message || j?.error || raw || msg; } catch(e) { msg = raw || msg; }
                          alert(msg);
                          return;
                        }

                        const updated = await res.json().catch(() => null);
                        if (updated) {
                          // actualizar user en localStorage si backend devuelve el usuario
                          localStorage.setItem('user', JSON.stringify(updated));
                        }
                        alert('Perfil actualizado correctamente');
                        setShowEditForm(false);
                      } catch (err) {
                        console.error('Error actualizando perfil:', err);
                        alert(err instanceof Error ? err.message : 'Error de red');
                      }
                    })();
                  }}
                />
              </div>
            </div>
          )}

          {/* Formulario para cambiar contraseña */}
          {showPasswordForm && (
            <div className="Profile-form">
              <div className="form-center">
                <Form
                  fields={[
                    { id: 'currentPassword', name: 'currentPassword', label: 'Contraseña actual', type: 'password', required: true },
                    { id: 'newPassword', name: 'newPassword', label: 'Nueva contraseña', type: 'password', required: true, minLength: 6 },
                    { id: 'confirmPassword', name: 'confirmPassword', label: 'Confirmar contraseña', type: 'password', required: true, minLength: 6 }
                  ]}
                  entity="Contraseña"
                  mode="edit"
                  submitLabel="Cambiar contraseña"
                  onSubmit={(data) => {
                    const payload: Record<string, any> = {};
                    if (data instanceof FormData) {
                      data.forEach((v, k) => { payload[k] = v; });
                    } else Object.assign(payload, data);
                    // Validación simple: nueva y confirm
                    if (payload.newPassword !== payload.confirmPassword) {
                      alert('La nueva contraseña y la confirmación no coinciden');
                      return;
                    }

                    // Construir payload completo con todas las claves de user
                    const userFields = formFieldsByEntity['user'] || [];
                    userFields.forEach((f) => {
                      if (!(f.name in payload)) {
                        payload[f.name] = (u && (u[f.name] !== undefined && u[f.name] !== null)) ? u[f.name] : '';
                      }
                    });

                    // Añadir campos de contraseña al payload en el formato que espera el backend
                    payload.currentPassword = payload.currentPassword || '';
                    if (payload.newPassword) {
                      payload.password = payload.newPassword; // mapear a 'password' si el backend lo espera
                    }
                    delete payload.newPassword;
                    delete payload.confirmPassword;

                    (async () => {
                      const API_BASE = 'http://localhost:3000';
                      try {
                        const token = localStorage.getItem('token');
                        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                        if (token) headers['Authorization'] = `Bearer ${token}`;

                        // Intentar endpoints: primero POST a /api/user/:id/password con payload completo,
                        // si falla, intentar PUT a /api/user/:id con payload completo
                        const uid = user ? user.id : '';
                        const changePassUrl = uid ? `${API_BASE}/api/user/${uid}/password` : `${API_BASE}/api/user/password`;
                        let resPwd = await fetch(changePassUrl, { method: 'POST', headers, body: JSON.stringify(payload) }).catch(() => null);
                        if (!resPwd || !resPwd.ok) {
                          const putUrl = uid ? `${API_BASE}/api/user/${uid}` : `${API_BASE}/api/user`;
                          resPwd = await fetch(putUrl, { method: 'PUT', headers, body: JSON.stringify(payload) }).catch(() => null);
                        }

                        if (!resPwd || !resPwd.ok) {
                          const raw = await (resPwd ? resPwd.text().catch(() => '') : Promise.resolve(''));
                          if (import.meta.env.MODE === 'development') {
                            // eslint-disable-next-line no-console
                            console.debug('[Profile] change-password fallo (final):', resPwd?.status, resPwd?.statusText, raw);
                          }
                          let msg = 'Error al cambiar contraseña';
                          try { const j = JSON.parse(raw); msg = j?.message || j?.error || raw || msg; } catch(e) { msg = raw || msg; }
                          alert(msg);
                          return;
                        }

                        alert('Contraseña cambiada correctamente');
                        setShowPasswordForm(false);
                      } catch (err) {
                        console.error('Error cambiando contraseña:', err);
                        alert(err instanceof Error ? err.message : 'Error de red');
                      }
                    })();
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Profile;
