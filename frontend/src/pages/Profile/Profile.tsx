/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Form from "../../components/form/Form";
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import formFieldsByEntity, { managerDirectorFields, ROLE_MAPPING } from "../../config/formSource";
import type { Field } from "../../config/formSource";
import { useAuth } from '../../contexts/auth/AuthContext';
import "./profile.css";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  // Estados para ConfirmDialog
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  
  // Campos dinámicos basados en el rol seleccionado
  const userFormFields = useMemo<Field[]>(() => {
    const baseFields = formFieldsByEntity['user'] || [];
    const roleNormalized = selectedRole.toLowerCase();
    
    if (roleNormalized === 'manager' || roleNormalized === 'director') {
      return [...baseFields, ...managerDirectorFields];
    } else if (roleNormalized === 'apprentice' || roleNormalized === 'aprendiz') {
      return [...baseFields];
    } else if (roleNormalized === 'artist' || roleNormalized === 'artista') {
      return [...baseFields];
    }
    
    return baseFields;
  }, [selectedRole]);
  
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
      setDialogMessage('No hay usuario autenticado');
      setOpenError(true);
      return;
    }

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
        setDialogMessage(msg);
        setOpenError(true);
        return;
      }

      // limpiar almacenamiento y redirigir al login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      setDialogMessage(err instanceof Error ? err.message : 'Error de red');
      setOpenError(true);
    }
  };

  const handleSubmit = (data: FormData | Record<string, any>) => {
    // Verificar que solo el admin pueda crear usuarios
    if (user?.role !== 'admin') {
      setDialogMessage('No tienes permisos para crear usuarios. Solo el administrador puede realizar esta acción.');
      setOpenError(true);
      return;
    }

    // Envío real al backend: POST http://localhost:3000/api/user/
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else {
      Object.assign(payload, data);
    }
    
    // Detectar el rol seleccionado del formulario
    const formRole = (payload.rol || payload.role || '').toLowerCase();
    if (formRole) {
      setSelectedRole(formRole);
    }

    (async () => {
      try {
  // aqui va el endpoint
  console.log('=== INICIO CREACIÓN DE USUARIO ===');
  console.log('Payload recibido del formulario:', payload);

        // Compatibilidad: si backend espera 'name' en lugar de 'username', rellenarlo desde username
        if (!payload.name && payload.username) {
          payload.name = payload.username;
        }

        // Normalizar el rol usando el mapeo correcto
        // El formulario envía: Admin, Manager, Director, Artista, Aprendiz
        // El backend valida con 'role in Role' y espera las keys: Admin, Manager, Director, Artist, Apprentice
        let userRole = payload.rol || payload.role || '';
        
        console.log('Rol recibido del formulario:', userRole);
        
        // Usar el mapeo para convertir del formulario a las keys del backend
        if (ROLE_MAPPING[userRole]) {
          userRole = ROLE_MAPPING[userRole];
        }
        
        console.log('Rol normalizado para backend:', userRole);
        
        payload.role = userRole;
        delete payload.rol; // Eliminar 'rol' si existe

        // Limpiar campos innecesarios antes de procesar
        delete payload.username; // El backend espera 'name', no 'username'

        // Validar rol (con mayúscula inicial como espera el backend)
        const validRoles = ['Admin', 'Manager', 'Director', 'Apprentice', 'Artist'];
        if (!validRoles.includes(userRole)) {
          setDialogMessage(`Rol inválido: ${userRole}. Debe ser uno de: ${validRoles.join(', ')}`);
          setOpenError(true);
          return;
        }

  // Obtener token de autenticación
        const token = localStorage.getItem('token');
        if (!token) {
          setDialogMessage('Debe iniciar sesión para crear usuarios');
          setOpenError(true);
          return;
        }
        
        console.log('Token obtenido, procesando según rol...');

        // Función auxiliar para buscar agencia por nombre
        const getAgencyIdByName = async (agencyName: string): Promise<number | null> => {
          try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // El backend espera query params para buscar por nombre
            const url = `${API_BASE}/api/agency/search/agency_name?name=${encodeURIComponent(agencyName)}`;
            console.log('Consultando', url);
            const res = await fetch(url, { headers });
            console.log('Respuesta agency/search/agency_name - status:', res.status);

            if (!res.ok) {
              const raw = await res.text().catch(() => '');
              console.error('Error obteniendo agencia, status:', res.status, raw);
              return null;
            }

            const data = await res.json().catch(() => null);
            console.log('Datos recibidos de agency/search:', data);

            // La API puede devolver la agencia directamente o dentro de data
            const agency = data?.data ?? data;
            if (!agency) {
              console.warn('Respuesta vacía al buscar agencia:', agencyName);
              return null;
            }

            // Si devuelve un array, tomar el primero
            if (Array.isArray(agency)) {
              if (agency.length === 0) return null;
              return agency[0]?.id ?? null;
            }

            // Si devuelve el objeto de la agencia, devolver su id
            return agency.id ?? null;
          } catch (error) {
            console.error('Error buscando agencia:', error);
            return null;
          }
        };

        // Función auxiliar para buscar aprendiz por nombre
        const getApprenticeIdByName = async (apprenticeName: string): Promise<number | null> => {
          try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            
            // Usar endpoint específico del backend: /api/apprentice/name/:name
            const url = `${API_BASE}/api/apprentice/name/${encodeURIComponent(apprenticeName)}`;
            console.log('Consultando', url);
            const res = await fetch(url, { headers });
            console.log('Respuesta apprentice/name - status:', res.status);
            
            if (!res.ok) {
              console.error('Error obteniendo aprendiz, status:', res.status);
              return null;
            }
            
            const data = await res.json();
            console.log('Aprendiz obtenido:', data);
            
            // El backend puede devolver el aprendiz directamente o dentro de data
            const apprentice = data?.data ?? data;
            if (!apprentice || !apprentice.id) {
              console.warn('No se encontró aprendiz:', apprenticeName);
              return null;
            }
            
            return apprentice.id;
          } catch (error) {
            console.error('Error buscando aprendiz:', error);
            return null;
          }
        };

        // Función auxiliar para buscar artista por IdAp (apprenticeId) y obtener su IdGr
        const getArtistGroupByApprenticeId = async (apprenticeId: number): Promise<number | null> => {
          try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            
            console.log('Buscando artista con apprenticeId:', apprenticeId);
            const res = await fetch(`${API_BASE}/api/artist`, { headers });
            console.log('Respuesta artistas - status:', res.status);
            
            if (!res.ok) {
              console.error('Error obteniendo artistas, status:', res.status);
              return null;
            }
            
            const data = await res.json();
            console.log('Artistas obtenidos:', data);
            
            const artists = data.data || data;
            console.log('Total artistas:', artists.length);
            
            // Buscar artista por apprenticeId (IdAp)
            const artist = artists.find((a: any) => 
              a.apprenticeId === apprenticeId || 
              a.IdAp === apprenticeId ||
              a.idAp === apprenticeId
            );
            
            console.log('Artista encontrado:', artist);
            
            if (!artist) {
              console.warn('No se encontró artista con apprenticeId:', apprenticeId);
              return null;
            }
            
            // Retornar el IdGr (groupId)
            const groupId = artist.groupId || artist.IdGr || artist.idGr || null;
            console.log('Grupo del artista (IdGr):', groupId);
            return groupId;
          } catch (error) {
            console.error('Error buscando artista por apprenticeId:', error);
            return null;
          }
        };

        // Limpiar payload: enviar solo los campos que el backend espera
        const finalPayload: Record<string, any> = {
          email: payload.email,
          name: payload.name,
          password: payload.password,
          role: payload.role
        };

        // Obtener IDs consultando al backend según el rol
        // userRole ya está con mayúscula inicial después del mapeo
        
        if (userRole === 'Manager' || userRole === 'Director') {
          console.log('Procesando Manager/Director...');
          if (!payload.agencyName) {
            setDialogMessage('Debe proporcionar el nombre de la agencia');
            setOpenError(true);
            return;
          }
          console.log('Buscando agencia:', payload.agencyName);
          const agencyId = await getAgencyIdByName(payload.agencyName);
          if (!agencyId) {
            setDialogMessage(`No se encontró la agencia con nombre: ${payload.agencyName}`);
            setOpenError(true);
            return;
          }
          console.log('Agencia encontrada con ID:', agencyId);
          finalPayload.agencyId = agencyId;
          
        } else if (userRole === 'Apprentice') {
          console.log('Procesando Apprentice...');
          if (!payload.name) {
            setDialogMessage('Debe proporcionar el nombre de usuario');
            setOpenError(true);
            return;
          }
          
          console.log('Buscando aprendiz por nombre de usuario:', payload.name);
          const apprenticeId = await getApprenticeIdByName(payload.name);
          if (!apprenticeId) {
            setDialogMessage(`No se encontró el aprendiz con nombre: ${payload.name}`);
            setOpenError(true);
            return;
          }
          console.log('Aprendiz encontrado con ID:', apprenticeId);
          
          finalPayload.IdAp = apprenticeId;
          
        } else if (userRole === 'Artist') {
          console.log('Procesando Artist...');
          if (!payload.name) {
            setDialogMessage('Debe proporcionar el nombre de usuario');
            setOpenError(true);
            return;
          }
          
          // Paso 1: Buscar el aprendiz por nombre para obtener IdAp
          console.log('Paso 1: Buscando aprendiz por nombre:', payload.name);
          const apprenticeId = await getApprenticeIdByName(payload.name);
          if (!apprenticeId) {
            setDialogMessage(`No se encontró el aprendiz con nombre: ${payload.name}`);
            setOpenError(true);
            return;
          }
          console.log('Aprendiz encontrado con ID:', apprenticeId);
          
          // Paso 2: Buscar el artista usando IdAp para obtener IdGr
          console.log('Paso 2: Buscando artista con apprenticeId:', apprenticeId);
          const groupId = await getArtistGroupByApprenticeId(apprenticeId);
          
          if (!groupId) {
            setDialogMessage(`El aprendiz "${payload.name}" no está registrado como artista o no tiene grupo asignado`);
            setOpenError(true);
            return;
          }
          console.log('Artista encontrado con IdGr:', groupId);
          
          // Asignar ambos IDs al payload
          finalPayload.IdAp = apprenticeId;
          finalPayload.IdGr = groupId;
        } else {
          console.log('Rol Admin - no requiere campos adicionales');
        }

        console.log('Payload final a enviar:', finalPayload);

        const res = await fetch(`${API_BASE}/api/user`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(finalPayload),
        });

        console.log('Response status:', res.status);
        
        const responseData = await res.json().catch(() => null);
        console.log('Response data:', responseData);
        
        if (!res.ok) {
          // El backend retorna { success: false, error: "mensaje" }
          const msg = responseData?.error || responseData?.message || `Error al crear usuario (${res.status})`;
          setDialogMessage(msg);
          setOpenError(true);
          console.error('Error del servidor:', responseData);
          return;
        }

        // El backend retorna { success: true, data: {...} }
        if (responseData?.success) {
          setDialogMessage('Usuario creado correctamente');
          setOpenSuccess(true);
          setShowUserForm(false);
        } else {
          setDialogMessage('Usuario creado pero respuesta inesperada');
          setOpenError(true);
          console.warn('Respuesta inesperada:', responseData);
        }
      } catch (err) {
        console.error('Error creando usuario:', err);
        setDialogMessage(err instanceof Error ? err.message : 'Error de red');
        setOpenError(true);
      }
    })();
  };
  
  return (
    <div className="Profile-sidebar">
      <Sidebar collapsed={collapsed} role={user?.role || 'admin'}/>
      <div className="Profile-navbar">
        {/* <NavBar /> */}

        <div className="Profile-content">
          <Header title='Perfil' description='Información y ajustes de tu cuenta' showlogo={false} collapsed={collapsed} setCollapsed={setCollapsed}/>

          {/* Mostrar datos del usuario logueado en tarjeta principal */}
          <div className="profile-container" style={{ marginTop: 12 }}>
            {user ? (<>
              <div className="profile-card">
                <div className="profile-top" style={{ alignItems: 'center', display: 'flex' }}>
                  {/* Avatar: si el usuario tiene avatarUrl, mostrar imagen, si no, icono por defecto */}
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name ?? 'Avatar'}
                      className="profile-avatar-img"
                    />
                  ) : (
                    <AccountCircleIcon 
                      className="profile-avatar-icon"
                      sx={{ 
                        fontSize: 80, 
                        color: '#7451f8',
                        marginRight: '20px'
                      }}
                    />
                  )}

                  {/* Meta principal: nombre, email y rol */}
                  <div className="profile-meta">
                    <h2>{displayName}</h2>
                    <p className="meta-line"><strong>Email:</strong> {user.email ?? '-'}</p>
                    <p className="meta-line"><strong>Rol:</strong> {displayRole}</p>
                    
                    {/* Campos dinámicos según el rol */}
                    {(user.role === 'manager' || user.role === 'director') && user.agencyId && (
                      <p className="meta-line"><strong>ID Agencia:</strong> {user.agencyId}</p>
                    )}

                    
                    <div className="profile-actions">
                      {
                      <button className="btn btn-primary" onClick={() => { setShowPasswordForm(true); setShowUserForm(false); }}>
                        Cambiar contraseña
                      </button>
                      }
                    </div>
                  </div>

                  {/* ID en la esquina superior derecha del header (alineado a la derecha dentro del flex) */}
                  <div className="profile-id-top">{user.id ?? '-'}</div>
                </div>
              <button className="delete-profile-btn" onClick={() => setOpenConfirmDelete(true)}>
                Eliminar perfil
              </button>
              </div>
              </>) : (
              <div className="profile-card">
                <p>No hay usuario autenticado</p>
              </div>
            )}
          </div>

          {/*{/* Contenedor con los dos botones solicitados debajo del header/tarjeta }
          {user?.role === 'admin' && (
            <div className="profile-button-row" style={{ marginTop: 18 }}>
              <button className="primary-btn" onClick={() => { setShowUserForm(!showUserForm); setShowPasswordForm(false); }}>
                Añadir usuario
              </button>
            </div>
          )*/}

          {showUserForm && user?.role === 'admin' && (
            <div className="Profile-form">
              <div className="form-center">
                <Form 
                  fields={userFormFields} 
                  entity="Usuario" 
                  onSubmit={handleSubmit}
                  onChange={(fieldName, value) => {
                    // Detectar cambios en el campo 'role' o 'rol'
                    if (fieldName === 'role' || fieldName === 'rol') {
                      setSelectedRole(String(value || ''));
                    }
                  }}
                />
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
                        if (!pfCurrent.trim()) {
                          setDialogMessage('Debe ingresar la contraseña actual');
                          setOpenError(true);
                          return;
                        }
                        if (!pfNew.trim()) {
                          setDialogMessage('Debe ingresar la nueva contraseña');
                          setOpenError(true);
                          return;
                        }
                        if (pfNew.length < 6) {
                          setDialogMessage('La nueva contraseña debe tener al menos 6 caracteres');
                          setOpenError(true);
                          return;
                        }
                        if (pfNew !== pfConfirm) {
                          setDialogMessage('La nueva contraseña y la confirmación no coinciden');
                          setOpenError(true);
                          return;
                        }
                        if (!user) {
                          setDialogMessage('No hay usuario autenticado');
                          setOpenError(true);
                          return;
                        }

                        const API_BASE = 'http://localhost:3000';
                        try {
                          const token = localStorage.getItem('token');
                          if (!token) {
                            setDialogMessage('Debe iniciar sesión para cambiar la contraseña');
                            setOpenError(true);
                            return;
                          }

                          const headers: Record<string, string> = {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          };

                          // ============================================
                          // SECCIÓN: BACKEND ENDPOINT PARA CAMBIAR CONTRASEÑA
                          // ============================================
                          // Usar el endpoint específico para cambiar contraseña: PUT /api/user/:id
                          // El backend espera: { currentPassword, newPassword }
                          const payload = {
                            currentPassword: pfCurrent,
                            newPassword: pfNew
                          };

                          console.log('Cambiando contraseña para usuario:', user.id);

                          const res = await fetch(`${API_BASE}/api/user/${user.id}`, {
                            method: 'PUT',
                            headers,
                            body: JSON.stringify(payload)
                          });

                          console.log('Response status:', res.status);

                          if (!res.ok) {
                            const raw = await res.text().catch(() => '');
                            let msg = 'Error al cambiar contraseña';
                            try {
                              const j = JSON.parse(raw);
                              msg = j?.message || j?.error || raw || msg;
                            } catch(e) {
                              msg = raw || msg;
                            }
                            setDialogMessage(msg);
                            setOpenError(true);
                            console.error('Error del servidor:', raw);
                            return;
                          }

                          const responseData = await res.json().catch(() => null);
                          console.log('Respuesta del servidor:', responseData);

                          // Actualizar usuario en localStorage si el backend devuelve datos actualizados
                          if (responseData?.data) {
                            localStorage.setItem('user', JSON.stringify(responseData.data));
                          }

                          setDialogMessage('Contraseña cambiada correctamente');
                          setOpenSuccess(true);
                          setPfCurrent('');
                          setPfNew('');
                          setPfConfirm('');
                          setShowPasswordForm(false);
                          // ============================================
                          // FIN SECCIÓN: BACKEND ENDPOINT
                          // ============================================

                        } catch (err) {
                          console.error('Error cambiando contraseña:', err);
                          setDialogMessage(err instanceof Error ? err.message : 'Error de red');
                          setOpenError(true);
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

      {/* ConfirmDialogs */}
      <ConfirmDialog 
        message="¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
        open={openConfirmDelete}
        onCancel={() => setOpenConfirmDelete(false)}
        onConfirm={handleDeleteProfile}
        title="Confirmar eliminación"
      />
      <ConfirmDialog 
        title="¡Éxito!"
        message={dialogMessage}
        open={openSuccess}
        onCancel={() => setOpenSuccess(false)}
        onConfirm={() => setOpenSuccess(false)}
        confirmText="Aceptar"
        showDeleteButton={false}
      />
      <ConfirmDialog 
        title="Error"
        message={dialogMessage}
        open={openError}
        onCancel={() => setOpenError(false)}
        onConfirm={() => setOpenError(false)}
        confirmText="Aceptar"
        showDeleteButton={false}
      />
    </div>
  );
};

export default Profile;
