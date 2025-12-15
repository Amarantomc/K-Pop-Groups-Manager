/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import Datatable from "../../components/datatable/Datatable";
import { userColumns } from "../../config/datatableSource";
import { useAuth } from "../../contexts/auth/AuthContext";
import PageLayout from "../../components/pageLayout/PageLayout";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import { userConstraints } from "../../config/modalConstraints";
import formFieldsByEntity, { managerDirectorFields, ROLE_MAPPING, apprenticeUserFields, artistUserFields } from "../../config/formSource";
import type { Field } from "../../config/formSource";
import "./users.css";

const ListUsers: React.FC = () => {
    // Opciones para selects dinámicos
    const [apprenticeOptions, setApprenticeOptions] = useState<{ label: string, value: string }[]>([]);
    const [artistApprenticeOptions, setArtistApprenticeOptions] = useState<{ label: string, value: string }[]>([]);

    const [selectedRole, setSelectedRole] = useState<string>('');
    // Cargar aprendices y aprendices-artistas al cambiar el rol seleccionado
    useEffect(() => {
        const fetchApprentices = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                const res = await fetch('http://localhost:3000/api/apprentice', { headers });
                const data = await res.json();
                // Solo nombre real, value es id
                const options = (data.data || data).map((a: any) => ({ label: a.name, value: a.id }));
                console.log('[Users] Opciones de aprendices cargadas (solo nombre real):', options);
                setApprenticeOptions(options);
            } catch (e) {
                console.error('[Users] Error cargando aprendices:', e);
                setApprenticeOptions([]);
            }
        };
        const fetchArtistApprentices = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers: Record<string, string> = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;
                const resArtist = await fetch('http://localhost:3000/api/artist', { headers });
                const dataArtist = await resArtist.json();
                const artists = dataArtist.data || dataArtist;
                // Opciones: usar realName como label y value
                let options = artists
                    .filter((a: any) => a.realName && a.realName.trim() !== '')
                    .map((a: any) => ({ label: a.realName, value: a.realName }));
                if (options.length === 0) {
                    console.warn('[Users] ¡No se encontraron artistas válidos! Revisa los datos de artistas.');
                }
                setArtistApprenticeOptions(options);
            } catch (e) {
                console.error('[Users] Error cargando artistas:', e);
                setArtistApprenticeOptions([]);
            }
        };
        console.log('[Users] selectedRole en useEffect:', selectedRole);
        if (selectedRole === 'apprentice' || selectedRole === 'aprendiz') {
            fetchApprentices();
        } else if (selectedRole === 'artist' || selectedRole === 'artista') {
            fetchArtistApprentices();
        }
    }, [selectedRole]);
    const { user } = useAuth();
    const [userRows, setUserRows] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [openAccept, setOpenAccept] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState<number | null>(null);
    const [openError, setOpenError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const userFormFields = useMemo<Field[]>(() => {
        const baseFields = formFieldsByEntity['user'] || [];
        const roleNormalized = selectedRole.toLowerCase();
        let fields = baseFields.map(f => {
            if (f.id === 'username' && (roleNormalized === 'apprentice' || roleNormalized === 'aprendiz')) {
                // Usa la config especial de apprenticeUserFields[0] pero con las opciones dinámicas (value=id)
                return { ...apprenticeUserFields[0], options: apprenticeOptions };
            }
            if (f.id === 'username' && (roleNormalized === 'artist' || roleNormalized === 'artista')) {
                // Usa la config especial de artistUserFields[0] pero con las opciones dinámicas (value=id)
                return { ...artistUserFields[0], options: artistApprenticeOptions };
            }
            return f;
        });
        if (roleNormalized === 'manager' || roleNormalized === 'director') {
            fields = [...fields, ...managerDirectorFields];
        }
        console.log('[Users] Campos finales para el formulario:', fields);
        return fields;
    }, [selectedRole, apprenticeOptions, artistApprenticeOptions]);

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
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response)
                if (!response.ok) {
                    throw new Error("Error al obtener los usuarios");
                }
                const data = await response.json();
                console.log(data);
                // Mapeo de roles backend -> español para la tabla
                const ROLE_LABELS: Record<string, string> = {
                    'Admin': 'Admin',
                    'Manager': 'Manager',
                    'Director': 'Director',
                    'Artist': 'Artista',
                    'Apprentice': 'Aprendiz',
                };
                const formattedData = data.data.map((user: any, index: number) => {
                    // Buscar el rol ignorando mayúsculas/minúsculas, pero mostrar el label exacto
                    const foundKey = Object.keys(ROLE_LABELS).find(k => k.toLowerCase() === String(user.role).toLowerCase());
                    return {
                        id: user.id ?? index,
                        username: user.name,
                        email: user.email,
                        role: foundKey ? ROLE_LABELS[foundKey] : user.role
                    };
                });
                setUserRows(formattedData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchUsers();
    }, [user]);

    // Eliminada la lógica de join artistas+aprendices, ahora se maneja en el modal

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
            console.log('[Users] handleCreateSave - INICIO', data);
        console.log('[Users] handleCreateSave - datos recibidos:', data);
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

        // Si el campo username es un select, su value es el id del aprendiz
        if (payload.username) {
                        console.log('[Users] handleCreateSave - username detectado, apprenticeOptions:', apprenticeOptions, 'artistApprenticeOptions:', artistApprenticeOptions);
            console.log('[Users] Valor de username recibido:', payload.username);
            // Buscar el nombre real para el payload.name si es necesario
            const allOptions = [...apprenticeOptions, ...artistApprenticeOptions];
            const found = allOptions.find(opt => String(opt.value) === String(payload.username));
            if (found) payload.name = found.label;
                        console.log('[Users] handleCreateSave - found para username:', found);
            // Si el rol es artista, el value es el realName, así que apprenticeId se buscará después
            if (formRole === 'artist' || formRole === 'artista') {
                                console.log('[Users] handleCreateSave - rol artista, no asigna apprenticeId aquí');
                                console.log('[Users] handleCreateSave - rol aprendiz, asignando apprenticeId:', payload.username);
                // No asignar apprenticeId aquí, se buscará por nombre real más adelante
            } else {
                payload.apprenticeId = Number(payload.username);
            }
        }
        console.log('[Users] handleCreateSave - payload normalizado:', payload);
                            console.log('[Users] handleCreateSave - flujo rol Apprentice, payload:', payload);
        if (formRole) {
            setSelectedRole(formRole);
        }

        (async () => {
            try {
                console.log('=== INICIO CREACIÓN DE USUARIO ===');
                console.log('[Users] Payload recibido del formulario:', payload);

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
                    // Asegurarse de que agencyId esté presente y sea un número
                    if (!payload.agencyId) {
                        setErrorMessage('Debe seleccionar una agencia');
                        setOpenError(true);
                        return;
                    }
                    const agencyIdNum = Number(payload.agencyId);
                    if (isNaN(agencyIdNum)) {
                        setErrorMessage('El valor de la agencia no es válido');
                        setOpenError(true);
                        return;
                    }
                    console.log('Agencia seleccionada con ID (número):', agencyIdNum);
                    finalPayload.agencyId = agencyIdNum;

                } else if (userRole === 'Apprentice') {
                    console.log('Procesando Apprentice...');
                    // Buscar el id del aprendiz de forma robusta
                    let apprenticeId = payload.apprenticeId || payload.username;
                    // Si no, intenta si name es un id numérico
                    if (!apprenticeId && payload.name && !isNaN(Number(payload.name))) {
                        apprenticeId = payload.name;
                    }
                    // Si no, busca el id por el nombre en apprenticeOptions
                    if (!apprenticeId && payload.name) {
                        const foundByName = apprenticeOptions.find(opt => opt.label === payload.name);
                        if (foundByName) apprenticeId = foundByName.value;
                    }
                    console.log('ApprenticeId detectado:', apprenticeId);
                    console.log('Payload completo:', payload);
                    if (!apprenticeId) {
                        setErrorMessage('Debe seleccionar un aprendiz');
                        setOpenError(true);
                        return;
                    }
                    // Buscar el aprendiz por id en la lista de aprendices
                    const foundApprentice = apprenticeOptions.find(opt => String(opt.value) === String(apprenticeId));
                    if (foundApprentice) {
                        finalPayload.IdAp = Number(foundApprentice.value);
                        finalPayload.name = foundApprentice.label;
                    } else {
                        finalPayload.IdAp = Number(apprenticeId);
                    }

                } else if (userRole === 'Artist') {
                    console.log('Procesando Artist...');
                    if (!payload.name) {
                        setErrorMessage('Debe proporcionar el nombre de usuario');
                        setOpenError(true);
                        return;
                    }
                    // Buscar el artista por realName
                    const token = localStorage.getItem('token');
                    const headers: Record<string, string> = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;
                    const resArtist = await fetch(`${API_BASE}/api/artist`, { headers });
                    const dataArtist = await resArtist.json();
                    const artists = dataArtist.data || dataArtist;
                    const artist = artists.find((a: any) => a.realName === payload.name);
                    if (!artist) {
                        setErrorMessage(`No se encontró el artista con nombre real: ${payload.name}`);
                        setOpenError(true);
                        return;
                    }
                    if (!artist.ApprenticeId && !artist.apprenticeId) {
                        setErrorMessage(`El artista "${payload.name}" no tiene ApprenticeId asociado.`);
                        setOpenError(true);
                        return;
                    }
                    if (!artist.GroupId && !artist.groupId) {
                        setErrorMessage(`El artista "${payload.name}" no tiene GroupId asociado.`);
                        setOpenError(true);
                        return;
                    }
                    finalPayload.IdAp = artist.ApprenticeId || artist.apprenticeId;
                    finalPayload.IdGr = artist.GroupId || artist.groupId;
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
                    // Agregar el nuevo usuario a la tabla con el rol mapeado
                    if (responseData?.data) {
                        const ROLE_LABELS: Record<string, string> = {
                            'Admin': 'Admin',
                            'Manager': 'Manager',
                            'Director': 'Director',
                            'Artist': 'Artista',
                            'Apprentice': 'Aprendiz',
                        };
                        const userRole = responseData.data.role;
                        const foundKey = Object.keys(ROLE_LABELS).find(k => k.toLowerCase() === String(userRole).toLowerCase());
                        const newRow = {
                            id: responseData.data.id ?? Date.now(),
                            username: responseData.data.name,
                            email: responseData.data.email,
                            role: foundKey ? ROLE_LABELS[foundKey] : userRole
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
                        type="confirm"
                    />
                    <ConfirmDialog
                        title="¡Éxito!"
                        message="Operación realizada correctamente"
                        open={openAccept}
                        type="success"
                        onCancel={() => setOpenAccept(false)}
                        onConfirm={() => setOpenAccept(false)}
                        confirmText="Aceptar"
                        showDeleteButton={false}
                    />
                    <ConfirmDialog
                        title="Error"
                        message={errorMessage}
                        type="error"
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
}

export default ListUsers;