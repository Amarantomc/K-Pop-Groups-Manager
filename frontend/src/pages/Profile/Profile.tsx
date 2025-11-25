/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
// import NavBar from '../../components/navbar/Navbar';
import "../../styles/profile.css";
import Form from "../../components/form/Form";
import formFieldsByEntity from "../../config/formSource";
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/header/Header';

const Profile: React.FC = () => {
  const { user } = useAuth();
  // Normalizar campos (solo los que usamos: name, email, rol)
  const u: any = user as any;
  const displayName = u?.name ?? 'Usuario';
  const displayRole = u?.rol ?? u?.role ?? '-';
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [pfCurrent, setPfCurrent] = useState('');
  const [pfNew, setPfNew] = useState('');
  const [pfConfirm, setPfConfirm] = useState('');

  const handleDeleteProfile = async () => {
    if (!user) {
      alert('No hay usuario autenticado');
      return;
    }
    const ok = window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!ok) return;

    const API_BASE = 'http://localhost:3000';
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/user/${user.id}`, { method: 'DELETE', headers });
      if (!res.ok) {
        const raw = await res.text().catch(() => '');
        let msg = 'Error al eliminar cuenta';
        try { const j = JSON.parse(raw); msg = j?.message || j?.error || raw || msg; } catch(e) { msg = raw || msg; }
        alert(msg);
        return;
      }

      // limpiar almacenamiento y redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      alert('Cuenta eliminada correctamente');
      window.location.href = '/login';
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      alert(err instanceof Error ? err.message : 'Error de red');
    }
  };

  // Sanitize user object: return only primitive fields and arrays of primitives
  const sanitizeUserForUpdate = (u: any) => {
    const out: Record<string, any> = {};
    if (!u || typeof u !== 'object') return out;
    Object.keys(u).forEach((k) => {
      const v = u[k];
      const t = typeof v;
      if (v === null) {
        out[k] = null;
      } else if (t === 'string' || t === 'number' || t === 'boolean') {
        out[k] = v;
      } else if (Array.isArray(v)) {
        // include arrays only if they contain primitives
        const ok = v.every((item) => item === null || ['string', 'number', 'boolean'].includes(typeof item));
        if (ok) out[k] = v;
      }
      // ignore objects, functions, undefined, symbols
    });
    return out;
  };

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
  const [collapsed,setCollapsed] = useState(false)
  return (
    <div className="Profile-sidebar">
      <Sidebar collapsed={collapsed} />
      <div className="Profile-navbar">
        {/* <NavBar /> */}

        <div className="Profile-content">
          <Header title='Perfil' description='Información y ajustes de tu cuenta' showlogo={false} collapsed={collapsed} setCollapsed={setCollapsed}/>

          {/* Mostrar datos del usuario logueado en tarjeta principal */}
          <div className="profile-container" style={{ marginTop: 12 }}>
            {user ? (<>
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
                      {/* 
                      <button className="btn btn-primary" onClick={() => { setShowPasswordForm(true); setShowUserForm(false); }}>
                        Cambiar contraseña
                      </button>
                      */}
                    </div>
                  </div>

                  {/* ID en la esquina superior derecha del header (alineado a la derecha dentro del flex) */}
                  <div className="profile-id-top">{user.id ?? '-'}</div>
                </div>
              <button className="delete-profile-btn" onClick={handleDeleteProfile}>
                Eliminar perfil
              </button>
              </div>
              </>) : (
              <div className="profile-card">
                <p>No hay usuario autenticado</p>
              </div>
            )}
          </div>

          {/* Contenedor con los dos botones solicitados debajo del header/tarjeta */}
          <div className="profile-button-row" style={{ marginTop: 18 }}>
            <button className="primary-btn" onClick={() => { setShowUserForm(!showUserForm); setShowPasswordForm(false); }}>
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

          {/* Formulario de edición eliminado: solo se permite cambiar la contraseña desde el formulario específico */}

          {/* Formulario para cambiar contraseña (implementación controlada para evitar que el gestor de contraseñas muestre selección) */}
          {showPasswordForm && (
            <div className="Profile-form">
              <div className="form-center">
                <div className="Form">
                  <h1>Editar Contraseña</h1>
                  <div className="form-group">
                    <label htmlFor="pf_current">Contraseña actual</label>
                    <input id="pf_current" name="pf_current" type="password" placeholder="Contraseña actual" value={pfCurrent} onChange={(e) => setPfCurrent(e.target.value)} autoComplete="current-password" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pf_new">Nueva contraseña</label>
                    <input id="pf_new" name="pf_new" type="password" placeholder="Nueva contraseña" value={pfNew} onChange={(e) => setPfNew(e.target.value)} autoComplete="new-password" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pf_confirm">Confirmar contraseña</label>
                    <input id="pf_confirm" name="pf_confirm" type="password" placeholder="Confirmar contraseña" value={pfConfirm} onChange={(e) => setPfConfirm(e.target.value)} autoComplete="new-password" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button
                      className="btn-primary"
                      onClick={async () => {
                        // Validaciones cliente
                        if (pfNew !== pfConfirm) { alert('La nueva contraseña y la confirmación no coinciden'); return; }
                        if (!user) { alert('No hay usuario autenticado'); return; }

                        const API_BASE = 'http://localhost:3000';
                        try {
                          const token = localStorage.getItem('token');
                          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                          if (token) headers['Authorization'] = `Bearer ${token}`;

                          const uid = user.id;
                          // Intentar endpoint especializado primero
                          // Enviar la entidad completa del usuario con la nueva contraseña usando PUT
                          const putUrl = `${API_BASE}/api/user/${uid}`;
                          // Construir payload sanearizado para evitar objetos anidados o referencias
                          let userPayload: Record<string, any> = Object.assign({}, user || {});
                          userPayload.password = pfNew;
                          userPayload.newPassword = pfNew;
                          if (pfCurrent) userPayload.currentPassword = pfCurrent;
                          userPayload = Object.assign(userPayload, sanitizeUserForUpdate(userPayload));
                          // Log payload and headers in development to help debug backend validation errors
                          if (import.meta.env.MODE === 'development') {
                            try { console.debug('[Profile] PUT payload:', JSON.parse(JSON.stringify(userPayload))); } catch(e) { console.debug('[Profile] PUT payload (raw):', userPayload); }
                            try { console.debug('[Profile] PUT headers:', headers); } catch(e) {}
                          }
                          const res = await fetch(putUrl, { method: 'PUT', headers, body: JSON.stringify(userPayload) }).catch(() => null);

                          if (!res || !res.ok) {
                            const raw = await (res ? res.text().catch(() => '') : Promise.resolve(''));
                            // Log full response for debugging
                            try { console.error('[Profile] change-password response:', res?.status, raw); } catch(e) { console.error('[Profile] change-password response error'); }
                            let msg = 'Error al cambiar contraseña';
                            try { const j = JSON.parse(raw); msg = j?.message || j?.error || raw || msg; } catch(e) { msg = raw || msg; }
                            alert(`${msg} (status ${res?.status ?? 'no-res'})`);
                            return;
                          }

                          const updated = await res.json().catch(() => null);
                          if (updated) localStorage.setItem('user', JSON.stringify(updated));

                          alert('Contraseña cambiada correctamente');
                          setPfCurrent(''); setPfNew(''); setPfConfirm('');
                          setShowPasswordForm(false);
                        } catch (err) {
                          console.error('Error cambiando contraseña:', err);
                          alert(err instanceof Error ? err.message : 'Error de red');
                        }
                      }}
                    >
                      Cambiar contraseña
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
