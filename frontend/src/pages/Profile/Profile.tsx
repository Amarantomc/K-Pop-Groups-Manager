/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Form from "../../components/form/Form";
import PageLayout from '../../components/pageLayout/PageLayout';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import formFieldsByEntity, { managerDirectorFields, ROLE_MAPPING } from "../../config/formSource";
import type { Field } from "../../config/formSource";
import { useAuth } from '../../contexts/auth/AuthContext';
import "./profile.css";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [agencyName, setAgencyName] = useState<string>('');
  
  // Estados para ConfirmDialog
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openConfirmWithdraw, setOpenConfirmWithdraw] = useState(false);
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

  // Función para obtener el nombre de la agencia por ID
  const fetchAgencyName = async (agencyId: number) => {
    const API_BASE = 'http://localhost:3000';
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/agency/${agencyId}`, { headers });
      
      if (!res.ok) {
        console.error('Error al obtener agencia:', res.status);
        return;
      }

      const data = await res.json();
      const agency = data?.data ?? data;
      
      if (agency?.name) {
        setAgencyName(agency.name);
      }
    } catch (error) {
      console.error('Error obteniendo nombre de agencia:', error);
    }
  };

  // useEffect para cargar el nombre de la agencia cuando el componente se monta
  useEffect(() => {
    const agencyId = user?.profileData?.agencyId;
    if (agencyId && typeof agencyId === 'number') {
      fetchAgencyName(agencyId);
    }
  }, [user]);

  const handleWithdraw = async () => {
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

      // Llamar al endpoint de retiro del backend
      const res = await fetch(`${API_BASE}/api/user/${user.id}/withdraw`, { method: 'POST', headers });
      if (!res.ok) {
        const raw = await res.text().catch(() => '');
        let msg = 'Error al procesar el retiro';
        try { const j = JSON.parse(raw); msg = j?.message || j?.error || raw || msg; } catch(e) { msg = raw || msg; }
        setDialogMessage(msg);
        setOpenError(true);
        return;
      }

      // Mostrar mensaje de éxito
      setDialogMessage('Retiro procesado exitosamente');
      setOpenSuccess(true);
      setOpenConfirmWithdraw(false);
      
      // Opcional: cerrar sesión después del retiro
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // window.location.href = '/login';
    } catch (err) {
      console.error('Error al procesar retiro:', err);
      setDialogMessage(err instanceof Error ? err.message : 'Error de red');
      setOpenError(true);
    }
  };

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
        // Compatibilidad: si backend espera 'name' en lugar de 'username', rellenarlo desde username
        if (!payload.name && payload.username) {
          payload.name = payload.username;
        }

        // Normalizar el rol usando el mapeo correcto
        // El formulario envía: Admin, Manager, Director, Artista, Aprendiz
        // El backend valida con 'role in Role' y espera las keys: Admin, Manager, Director, Artist, Apprentice
        let userRole = payload.rol || payload.role || '';
        
        // Usar el mapeo para convertir del formulario a las keys del backend
        if (ROLE_MAPPING[userRole]) {
          userRole = ROLE_MAPPING[userRole];
        }
        
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

        // Función auxiliar para buscar agencia por nombre
        const getAgencyIdByName = async (agencyName: string): Promise<number | null> => {
          try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            // El backend espera query params para buscar por nombre
            const url = `${API_BASE}/api/agency/search/agency_name?name=${encodeURIComponent(agencyName)}`;
            const res = await fetch(url, { headers });

            if (!res.ok) {
              return null;
            }

            const data = await res.json().catch(() => null);

            // La API puede devolver la agencia directamente o dentro de data
            const agency = data?.data ?? data;
            if (!agency) {
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
            const res = await fetch(url, { headers });
            
            if (!res.ok) {
              return null;
            }
            
            const data = await res.json();
            
            // El backend puede devolver el aprendiz directamente o dentro de data
            const apprentice = data?.data ?? data;
            if (!apprentice || !apprentice.id) {
              return null;
            }
            
            return apprentice.id;
          } catch (error) {
            return null;
          }
        };

        // Función auxiliar para buscar artista por IdAp (apprenticeId) y obtener su IdGr
        const getArtistGroupByApprenticeId = async (apprenticeId: number): Promise<number | null> => {
          try {
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            
            const res = await fetch(`${API_BASE}/api/artist`, { headers });
            
            if (!res.ok) {
              return null;
            }
            
            const data = await res.json();
            
            const artists = data.data || data;
            
            // Buscar artista por apprenticeId (IdAp)
            const artist = artists.find((a: any) => 
              a.apprenticeId === apprenticeId || 
              a.IdAp === apprenticeId ||
              a.idAp === apprenticeId
            );
            
            if (!artist) {
              return null;
            }
            
            // Retornar el IdGr (groupId)
            const groupId = artist.groupId || artist.IdGr || artist.idGr || null;
            return groupId;
          } catch (error) {
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
          if (!payload.agencyName) {
            setDialogMessage('Debe proporcionar el nombre de la agencia');
            setOpenError(true);
            return;
          }
          const agencyId = await getAgencyIdByName(payload.agencyName);
          if (!agencyId) {
            setDialogMessage(`No se encontró la agencia con nombre: ${payload.agencyName}`);
            setOpenError(true);
            return;
          }
          finalPayload.agencyId = agencyId;
          
        } else if (userRole === 'Apprentice') {
          if (!payload.name) {
            setDialogMessage('Debe proporcionar el nombre de usuario');
            setOpenError(true);
            return;
          }
          
          const apprenticeId = await getApprenticeIdByName(payload.name);
          if (!apprenticeId) {
            setDialogMessage(`No se encontró el aprendiz con nombre: ${payload.name}`);
            setOpenError(true);
            return;
          }
          
          finalPayload.IdAp = apprenticeId;
          
        } else if (userRole === 'Artist') {
          if (!payload.name) {
            setDialogMessage('Debe proporcionar el nombre de usuario');
            setOpenError(true);
            return;
          }
          
          // Paso 1: Buscar el aprendiz por nombre para obtener IdAp
          const apprenticeId = await getApprenticeIdByName(payload.name);
          if (!apprenticeId) {
            setDialogMessage(`No se encontró el aprendiz con nombre: ${payload.name}`);
            setOpenError(true);
            return;
          }
          
          // Paso 2: Buscar el artista usando IdAp para obtener IdGr
          const groupId = await getArtistGroupByApprenticeId(apprenticeId);
          
          if (!groupId) {
            setDialogMessage(`El aprendiz "${payload.name}" no está registrado como artista o no tiene grupo asignado`);
            setOpenError(true);
            return;
          }
          
          // Asignar ambos IDs al payload
          finalPayload.IdAp = apprenticeId;
          finalPayload.IdGr = groupId;
        }

        const res = await fetch(`${API_BASE}/api/user`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(finalPayload),
        });
        
        const responseData = await res.json().catch(() => null);
        
        if (!res.ok) {
          // El backend retorna { success: false, error: "mensaje" }
          const msg = responseData?.error || responseData?.message || `Error al crear usuario (${res.status})`;
          setDialogMessage(msg);
          setOpenError(true);
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
        }
      } catch (err) {
        setDialogMessage(err instanceof Error ? err.message : 'Error de red');
        setOpenError(true);
      }
    })();
  };
  
  return (
    <PageLayout
      title="Perfil"
      description="Información y ajustes de tu cuenta"
    >
      {/* Mostrar datos del usuario logueado en tarjeta principal */}
      <div className="profile-container">
        {user ? (
          <>
            <div className="profile-card">
              <div className="profile-top">
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
                  <p className="meta-line-name"><strong>Nombre:</strong> {displayName}</p>
                  <p className="meta-line"><strong>Email:</strong> {user.email ?? '-'}</p>
                  <p className="meta-line"><strong>Rol:</strong> {displayRole}</p>
                  
                  {/* Campo de agencia para todos excepto admin */}
                  {user.role !== 'admin' && (
                    <p className="meta-line"><strong>Agencia:</strong> {agencyName || user.profileData?.agencyId || '-'}</p>
                  )}

                  
                  <div className="profile-actions">
                    <button className="button-change-password" onClick={() => { setShowPasswordForm(true); setShowUserForm(false); }}>
                      Cambiar contraseña
                    </button>
                    <button className="button-withdraw" onClick={() => setOpenConfirmWithdraw(true)}>
                      Retirar
                    </button>
                    <button className="button-delete-profile" onClick={() => setOpenConfirmDelete(true)}>
                      Eliminar perfil
                    </button>
                  </div>
                </div>

                {/* ID en la esquina superior derecha del header (alineado a la derecha dentro del flex) */}
                <div className="profile-id-top">{user.id ?? '-'}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="profile-card">
            <p>No hay usuario autenticado</p>
          </div>
        )}
      </div>

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

      {/* Formulario para cambiar contraseña (implementación controlada para evitar que el gestor de contraseñas muestre selección) */}
      {showPasswordForm && (
            <div className="Profile-form">
              <div className="form-center">
                <div className="Form password-form">
                  <h1>Cambiar Contraseña</h1>
                  <p className="form-description">Ingresa tu contraseña actual y la nueva contraseña</p>
                  <div className="form-group">
                    <label htmlFor="pf_current">Contraseña actual</label>
                    <input 
                      id="pf_current" 
                      name="pf_current" 
                      type="password" 
                      placeholder="Ingresa tu contraseña actual" 
                      value={pfCurrent} 
                      onChange={(e) => setPfCurrent(e.target.value)} 
                      autoComplete="current-password" 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pf_new">Nueva contraseña</label>
                    <input 
                      id="pf_new" 
                      name="pf_new" 
                      type="password" 
                      placeholder="Mínimo 6 caracteres" 
                      value={pfNew} 
                      onChange={(e) => setPfNew(e.target.value)} 
                      autoComplete="new-password" 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pf_confirm">Confirmar contraseña</label>
                    <input 
                      id="pf_confirm" 
                      name="pf_confirm" 
                      type="password" 
                      placeholder="Repite la nueva contraseña" 
                      value={pfConfirm} 
                      onChange={(e) => setPfConfirm(e.target.value)} 
                      autoComplete="new-password" 
                    />
                  </div>
                  <div className="password-form-actions">
                    <button
                      className="button-cancel-password"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPfCurrent('');
                        setPfNew('');
                        setPfConfirm('');
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="button-submit-password"
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

                          console.log('=== INICIO CAMBIO DE CONTRASEÑA ===');
                          console.log('Usuario ID:', user.id);
                          console.log('Payload a enviar:', payload); // Mostrar el payload completo temporalmente para depuración
                          console.log('Longitud currentPassword:', pfCurrent.length);
                          console.log('Longitud newPassword:', pfNew.length);
                          console.log('URL:', `${API_BASE}/api/user/${user.id}`);
                          console.log('Método: PUT');
                          console.log('Body JSON:', JSON.stringify(payload));

                          const res = await fetch(`${API_BASE}/api/user/${user.id}`, {
                            method: 'PUT',
                            headers,
                            body: JSON.stringify(payload)
                          });

                          console.log('Response status:', res.status);
                          console.log('Response OK:', res.ok);
                          console.log('Response statusText:', res.statusText);

                          if (!res.ok) {
                            const raw = await res.text().catch(() => '');
                            console.error('Error - Response raw:', raw);
                            let msg = 'Error al cambiar contraseña';
                            try {
                              const j = JSON.parse(raw);
                              console.error('Error - Response JSON:', j);
                              msg = j?.message || j?.error || raw || msg;
                            } catch(e) {
                              console.error('Error al parsear respuesta:', e);
                              msg = raw || msg;
                            }
                            setDialogMessage(msg);
                            setOpenError(true);
                            console.log('=== FIN CAMBIO DE CONTRASEÑA (ERROR) ===');
                            return;
                          }

                          const responseData = await res.json().catch(() => null);
                          console.log('Respuesta del servidor (JSON completa):', JSON.stringify(responseData, null, 2));
                          console.log('responseData.success:', responseData?.success);
                          console.log('responseData.data:', responseData?.data);
                          console.log('responseData.message:', responseData?.message);

                          // Verificar si el backend realmente cambió la contraseña
                          if (responseData?.success === false) {
                            const msg = responseData?.error || responseData?.message || 'El backend reportó un error';
                            console.error('Backend reportó error a pesar de status 200:', msg);
                            setDialogMessage(msg);
                            setOpenError(true);
                            console.log('=== FIN CAMBIO DE CONTRASEÑA (ERROR DEL BACKEND) ===');
                            return;
                          }

                          // Actualizar usuario en localStorage si el backend devuelve datos actualizados
                          if (responseData?.data) {
                            console.log('Actualizando usuario en localStorage');
                            localStorage.setItem('user', JSON.stringify(responseData.data));
                          } else {
                            console.warn('El backend no devolvió datos del usuario actualizados');
                          }

                          console.log('Contraseña cambiada exitosamente');
                          console.log('IMPORTANTE: Intenta hacer login con:');
                          console.log('- Email:', user.email);
                          console.log('- Nueva contraseña (longitud):', pfNew.length, 'caracteres');
                          console.warn('⚠️ NOTA: Si no puedes hacer login con la nueva contraseña,');
                          console.warn('⚠️ verifica que el backend esté hasheando y guardando correctamente.');
                          console.warn('⚠️ El endpoint PUT /api/user/:id debe:');
                          console.warn('⚠️ 1. Verificar currentPassword con bcrypt.compare()');
                          console.warn('⚠️ 2. Hashear newPassword con bcrypt.hash()');
                          console.warn('⚠️ 3. Guardar el nuevo hash en la base de datos');
                          setDialogMessage('Contraseña cambiada correctamente');
                          setOpenSuccess(true);
                          setPfCurrent('');
                          setPfNew('');
                          setPfConfirm('');
                          setShowPasswordForm(false);
                          console.log('=== FIN CAMBIO DE CONTRASEÑA (ÉXITO) ===');
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

      {/* ConfirmDialogs */}
      <ConfirmDialog 
        message="¿Estás seguro de que quiere retirarse? Esta acción procesará tu solicitud de retiro."
        open={openConfirmWithdraw}
        onCancel={() => setOpenConfirmWithdraw(false)}
        onConfirm={handleWithdraw}
        title="Confirmar retiro"
        type="confirm"
      />
      <ConfirmDialog 
        message="¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
        open={openConfirmDelete}
        onCancel={() => setOpenConfirmDelete(false)}
        onConfirm={handleDeleteProfile}
        title="Confirmar eliminación"
        type="confirm"
      />
      <ConfirmDialog 
        title="¡Éxito!"
        message={dialogMessage}
        open={openSuccess}
        type="success"
        onCancel={() => setOpenSuccess(false)}
        onConfirm={() => setOpenSuccess(false)}
        confirmText="Aceptar"
        showDeleteButton={false}
      />
      <ConfirmDialog 
        title="Error"
        message={dialogMessage}
        type="error"
        open={openError}
        onCancel={() => setOpenError(false)}
        onConfirm={() => setOpenError(false)}
        confirmText="Aceptar"
        showDeleteButton={false}
      />
    </PageLayout>
  );
};

export default Profile;
