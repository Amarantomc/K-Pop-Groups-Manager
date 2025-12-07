/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import Datatable from "../../components/datatable/Datatable";
import { userColumns } from "../../config/datatableSource";
import { useAuth } from "../../contexts/auth/AuthContext";
import PageLayout from "../../components/pageLayout/PageLayout";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import { userConstraints } from "../../config/modalConstraints";
import formFieldsByEntity, { managerDirectorFields, ROLE_MAPPING } from "../../config/formSource";
import type { Field } from "../../config/formSource";
import "./users.css";

const ListUsers: React.FC = () => {
    const { user } = useAuth();
    const [userRows, setUserRows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openAccept, setOpenAccept] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('');

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

    const askDelete = (id: number) => {
        setUserToDelete(id);
        setOpenConfirm(true);
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (!user) {
                    console.error('Usuario no autenticado');
                    return;
                }

                const token = localStorage.getItem('token');
                
                // Endpoint GET /api/user - Requiere rol Admin
                const response = await fetch('http://localhost:3000/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error("Error al obtener los usuarios");
                }
                const data = await response.json();
                console.log(data);
                const formattedData = data.data.map((user: any, index: number) => ({
                    id: user.id ?? index,
                    username: user.name,
                    email: user.email,
                }));
                setUserRows(formattedData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, [user]);

    const handleDelete = async () => {
        try {
            if (userToDelete === null) return;

            const token = localStorage.getItem('token');
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`http://localhost:3000/api/user/${userToDelete}`, {
                method: "DELETE",
                headers
            });

            const result = await response.json();
            if (result.success) {
                setUserRows((prev) => prev.filter((user) => user.id !== userToDelete));
                setOpenAccept(true);
            } else {
                console.error("Error al eliminar el usuario");
                setErrorMessage("Error al eliminar el usuario");
                setOpenError(true);
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar');
            setOpenError(true);
        } finally {
            setOpenConfirm(false);
            setUserToDelete(null);
        }
    };

    const handleCreateSave = async (data: FormData | Record<string, any>) => {
        // Verificar que solo el admin pueda crear usuarios
        if (user?.role !== 'admin') {
            setErrorMessage('No tienes permisos para crear usuarios. Solo el administrador puede realizar esta acción.');
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
                console.log('=== INICIO CREACIÓN DE USUARIO ===');
                console.log('Payload recibido del formulario:', payload);

                // Compatibilidad: si backend espera 'name' en lugar de 'username', rellenarlo desde username
                if (!payload.name && payload.username) {
                    payload.name = payload.username;
                }

                // Normalizar el rol usando el mapeo correcto
                let userRole = payload.rol || payload.role || '';
                
                console.log('Rol recibido del formulario:', userRole);
                
                // Usar el mapeo para convertir del formulario a las keys del backend
                if (ROLE_MAPPING[userRole]) {
                    userRole = ROLE_MAPPING[userRole];
                }
                
                console.log('Rol normalizado para backend:', userRole);
                
                payload.role = userRole;
                delete payload.rol;

                // Limpiar campos innecesarios antes de procesar
                delete payload.username;

                // Validar rol
                const validRoles = ['Admin', 'Manager', 'Director', 'Apprentice', 'Artist'];
                if (!validRoles.includes(userRole)) {
                    setErrorMessage(`Rol inválido: ${userRole}. Debe ser uno de: ${validRoles.join(', ')}`);
                    setOpenError(true);
                    return;
                }

                // Obtener token de autenticación
                const token = localStorage.getItem('token');
                if (!token) {
                    setErrorMessage('Debe iniciar sesión para crear usuarios');
                    setOpenError(true);
                    return;
                }
                
                console.log('Token obtenido, procesando según rol...');

                // Función auxiliar para buscar agencia por nombre
                const getAgencyIdByName = async (agencyName: string): Promise<number | null> => {
                    try {
                        const headers: Record<string, string> = {};
                        if (token) headers['Authorization'] = `Bearer ${token}`;

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

                        const agency = data?.data ?? data;
                        if (!agency) {
                            console.warn('Respuesta vacía al buscar agencia:', agencyName);
                            return null;
                        }

                        if (Array.isArray(agency)) {
                            if (agency.length === 0) return null;
                            return agency[0]?.id ?? null;
                        }

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
                if (userRole === 'Manager' || userRole === 'Director') {
                    console.log('Procesando Manager/Director...');
                    if (!payload.agencyName) {
                        setErrorMessage('Debe proporcionar el nombre de la agencia');
                        setOpenError(true);
                        return;
                    }
                    console.log('Buscando agencia:', payload.agencyName);
                    const agencyId = await getAgencyIdByName(payload.agencyName);
                    if (!agencyId) {
                        setErrorMessage(`No se encontró la agencia con nombre: ${payload.agencyName}`);
                        setOpenError(true);
                        return;
                    }
                    console.log('Agencia encontrada con ID:', agencyId);
                    finalPayload.agencyId = agencyId;
                    
                } else if (userRole === 'Apprentice') {
                    console.log('Procesando Apprentice...');
                    if (!payload.name) {
                        setErrorMessage('Debe proporcionar el nombre de usuario');
                        setOpenError(true);
                        return;
                    }
                    
                    console.log('Buscando aprendiz por nombre de usuario:', payload.name);
                    const apprenticeId = await getApprenticeIdByName(payload.name);
                    if (!apprenticeId) {
                        setErrorMessage(`No se encontró el aprendiz con nombre: ${payload.name}`);
                        setOpenError(true);
                        return;
                    }
                    console.log('Aprendiz encontrado con ID:', apprenticeId);
                    
                    finalPayload.IdAp = apprenticeId;
                    
                } else if (userRole === 'Artist') {
                    console.log('Procesando Artist...');
                    if (!payload.name) {
                        setErrorMessage('Debe proporcionar el nombre de usuario');
                        setOpenError(true);
                        return;
                    }
                    
                    console.log('Paso 1: Buscando aprendiz por nombre:', payload.name);
                    const apprenticeId = await getApprenticeIdByName(payload.name);
                    if (!apprenticeId) {
                        setErrorMessage(`No se encontró el aprendiz con nombre: ${payload.name}`);
                        setOpenError(true);
                        return;
                    }
                    console.log('Aprendiz encontrado con ID:', apprenticeId);
                    
                    console.log('Paso 2: Buscando artista con apprenticeId:', apprenticeId);
                    const groupId = await getArtistGroupByApprenticeId(apprenticeId);
                    
                    if (!groupId) {
                        setErrorMessage(`El aprendiz "${payload.name}" no está registrado como artista o no tiene grupo asignado`);
                        setOpenError(true);
                        return;
                    }
                    console.log('Artista encontrado con IdGr:', groupId);
                    
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
                    const msg = responseData?.error || responseData?.message || `Error al crear usuario (${res.status})`;
                    setErrorMessage(msg);
                    setOpenError(true);
                    console.error('Error del servidor:', responseData);
                    return;
                }

                if (responseData?.success) {
                    // Agregar el nuevo usuario a la tabla
                    if (responseData?.data) {
                        const newRow = {
                            id: responseData.data.id ?? Date.now(),
                            username: responseData.data.name,
                            email: responseData.data.email,
                        };
                        setUserRows((prev) => [...prev, newRow]);
                    }
                    setOpenAccept(true);
                } else {
                    setErrorMessage('Usuario creado pero respuesta inesperada');
                    setOpenError(true);
                    console.warn('Respuesta inesperada:', responseData);
                }
            } catch (err) {
                console.error('Error creando usuario:', err);
                setErrorMessage(err instanceof Error ? err.message : 'Error de red');
                setOpenError(true);
            }
        })();
    };

    // Callback para detectar cambios en el formulario del modal
    const handleModalFieldChange = (fieldName: string, value: any) => {
        // Detectar cambios en el campo 'role' o 'rol'
        if (fieldName === 'role' || fieldName === 'rol') {
            setSelectedRole(String(value || ''));
        }
    };

    return (
        <PageLayout 
            title="Usuarios" 
            description="Listado y gestión de usuarios."
        >
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    Cargando Usuarios...
                </div>
            ) : (
                <>
                    <Datatable
                        columns={userColumns}
                        rows={userRows}
                        pagesize={10}
                        onDelete={askDelete}
                        onCreateSave={handleCreateSave}
                        constraints={userConstraints}
                        createEntity="user"
                        createFields={userFormFields}
                        onFieldChange={handleModalFieldChange}
                        showEditButton={false}
                        showCreateButton={true}
                        userRole={user?.role}
                    />
                    <ConfirmDialog 
                        message="¿Está seguro que desea eliminar este usuario?" 
                        open={openConfirm} 
                        onCancel={() => setOpenConfirm(false)} 
                        onConfirm={handleDelete}
                    />
                    <ConfirmDialog 
                        title="¡Éxito!" 
                        message="El usuario ha sido creado correctamente" 
                        open={openAccept} 
                        onCancel={() => setOpenAccept(false)} 
                        onConfirm={() => setOpenAccept(false)} 
                        confirmText="Aceptar" 
                        showDeleteButton={false}
                    />
                    <ConfirmDialog 
                        title="Error" 
                        message={errorMessage} 
                        open={openError} 
                        onCancel={() => setOpenError(false)} 
                        onConfirm={() => setOpenError(false)} 
                        confirmText="Aceptar" 
                        showDeleteButton={false}
                    />
                </>
            )}
        </PageLayout>
    );
};

export default ListUsers;
