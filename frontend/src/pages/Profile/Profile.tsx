import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
// import NavBar from '../../components/navbar/Navbar';
import '../../styles/profile.css';
import Form from '../../components/form/Form';
import formFieldsByEntity from '../../formSource';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
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
              <div className="profile-card">
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

                    (async () => {
                      const API_BASE = 'http://localhost:3000';
                      try {
                        const token = localStorage.getItem('token');
                        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                        if (token) headers['Authorization'] = `Bearer ${token}`;

                        // aqui va el endpoint
                        // Intentar el endpoint principal y varios fallbacks comunes si el backend no expone /api/auth/change-password
                        const bodyChange = JSON.stringify({ currentPassword: payload.currentPassword, newPassword: payload.newPassword });
                        const tryPost = async (url: string) => fetch(url, { method: 'POST', headers, body: bodyChange });

                        const uid = user ? user.id : '';
                        // Cambiar contraseña: el backend gestiona usuarios en /api/user/:id
                        // Intentar POST a /api/user/:id/password (si existe), si no, enviar PUT a /api/user/:id con campos de contraseña
                        const changePassUrl = uid ? `${API_BASE}/api/user/${uid}/password` : `${API_BASE}/api/user/password`;
                        let resPwd = await tryPost(changePassUrl).catch(() => null);
                        if (resPwd && resPwd.ok) {
                          // éxito
                        } else {
                          // intentar PUT a /api/user/:id con los campos currentPassword/newPassword
                          const putUrl = uid ? `${API_BASE}/api/user/${uid}` : `${API_BASE}/api/user`;
                          resPwd = await fetch(putUrl, { method: 'PUT', headers, body: JSON.stringify({ currentPassword: payload.currentPassword, newPassword: payload.newPassword }) }).catch(() => null);
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
