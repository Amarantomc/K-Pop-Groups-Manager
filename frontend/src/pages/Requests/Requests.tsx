import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DataTable from '../../components/datatable/Datatable';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import PageLayout from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../contexts/auth/AuthContext';
import { requestConstraints } from '../../config/modalConstraints';
import { transformDate } from '../../components/calendar/Calendar';

interface Request {
  id: number;
  entityName: string;
  groupName: string;
  agency: string;
  date: string;
  concept: string;
  members: string[];
  roles: string[];
  agencyId: number | string;
  status: string;
  type: string;
}

const Requests: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractModalData, setContractModalData] = useState<any | null>(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [groupID, setGroupID] = useState<any>('');

  // Manejar aprobación de solicitud (Director)
  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/application/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al aprobar solicitud');
      }

      // Actualizar estado local
      setRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status: 'Aprobado' } : req)
      );
      console.log('Solicitud aprobada exitosamente:', id);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    }
  };

  // Manejar rechazo de solicitud (Director)
  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/application/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al rechazar solicitud');
      }

      // Actualizar estado local
      setRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status: 'Rechazado' } : req)
      );
      console.log('Solicitud rechazada:', id);
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
    }
  };

  // Crear grupo (Manager)
  const handleCreateGroup = async (requestId: number, groupName: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/group`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requestId,
          groupName,
          agencyId: user?.agencyId
        })
      });

      if (!response.ok) {
        throw new Error('Error al crear grupo');
      }

      await response.json();

      // Actualizar estado local
      setRequests(prev =>
        prev.map(req => req.id === requestId ? { ...req, status: 'completed' } : req)
      );

      console.log('Grupo creado exitosamente:', groupName, 'para solicitud:', requestId);
    } catch (error) {
      console.error('Error al crear grupo:', error);
    }
  };

  const handleOpenContractModal = async () => {

    const agencyId = user?.profileData?.agencyId || '';
    let agencyName = '';
    if (agencyId) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:3000/api/agency/${agencyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          agencyName = data?.name || '';
        }
      } catch (error) {
        console.error('Error al obtener el nombre de la agencia', error);
      }
    }
    setContractModalData({
      agencyId,
      agencyName,
    });
    setShowContractModal(true);
  };

  const handleContractSave = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      // Adaptar el payload al formato requerido por el backend
      const payload = {
        type: 'Group',
        agencyId: user?.profileData?.agencyId || user?.agencyId,
        startDate: formData.startDate,
        initialConditions: formData.terms,
        incomeDistribution: formData.value,
        groupId: groupID || formData.groupId || formData.GroupId || '',
      };
      const response = await fetch('http://localhost:3000/api/contract', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Error al ofrecer contrato');
      setSuccessMessage('Contrato ofrecido exitosamente');
      setOpenSuccess(true);
      setShowContractModal(false);
    } catch (error) {
      setErrorMessage('Error al ofrecer contrato');
      setOpenError(true);
    }
  };
  // Lógica para aceptar/rechazar solicitud como aprendiz o artista
  const handleAccept = async (requestId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/application/${requestId}/decision`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          //apprenticeId
          //role: user.role
        })
      });
      if (!response.ok) throw new Error('Error al aceptar solicitud');
      // Opcional: actualizar estado local o mostrar feedback
    } catch (error) {
      console.error('Error al aceptar solicitud:', error);
    }
  };
  const handleDeny = async (requestId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/application/decision`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          userId: user?.id,
          role: user?.role
        })
      });
      if (!response.ok) throw new Error('Error al negar solicitud');
      // Opcional: actualizar estado local o mostrar feedback
    } catch (error) {
      console.error('Error al negar solicitud:', error);
    }
  };

  const fetchAgencyName = async (id: number | string) => {
    if (!id) return '';
    const res = await fetch(`http://localhost:3000/api/agency/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) return id;
    const data = await res.json();
    return data?.data?.name || id;
  };
  const fetchConceptName = async (id: number | string) => {
    if (!id) return '';
    const res = await fetch(`http://localhost:3000/api/concept/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    if (!res.ok) return id;
    const data = await res.json();
    return data?.data?.name || id;
  };

  // Columnas del DataTable
  const baseColumns: GridColDef[] = [
    //{ field: 'id', headerName: 'ID', width: 70 },
    { field: 'groupName', headerName: 'Nombre de Grupo', width: 150 },
    {
      field: 'date',
      headerName: 'Fecha de Solicitud',
      width: 150,
    },
    //{ field: 'idConcept', headerName: 'ID Concepto', width: 120 },
    { field: 'concept', headerName: 'Concepto', width: 120 },
    {
      field: 'members',
      headerName: 'Miembros',
      width: 220,
      renderCell: (params) => {
        const members = Array.isArray(params.value)
          ? params.value.map((m: any) =>
            m.name ? `${m.name}${m.rol ? ` (${m.rol})` : ''}` : ''
          ).join(', ')
          : params.value || '';
        return (
          <span style={{ color: '#2563eb', fontWeight: 600 }}>{members}</span>
        );
      }
      /*
       renderCell: (params) => {
        const albums = params.value || [];
          if (albums.length === 0) {
        return (
          <Typography variant="body2" color="text.secondary" sx={{ width: '100%', py: 1 }}>
            Sin álbumes
          </Typography>
        );
      }
        return (
            <Select
            value=""
            displayEmpty
            sx={{ width: '100%', height: 40 }}
            renderValue={() => `${albums.length} álbum${albums.length !== 1 ? 'es' : ''}`}
            >
            {albums.map((album: any) => (
                <MenuItem key={album.id} value={album.id}>
                {album.title}
                </MenuItem>
            ))}
        </Select>
        );
    },
    */
    },
    {
      field: 'roles',
      headerName: 'Roles',
      width: 220,
      renderCell: (params) => {
        const roles = Array.isArray(params.value) ? params.value.join(', ') : params.value || '';
        return (
          <span style={{ color: '#10b981', fontWeight: 600 }}>{roles}</span>
        );
      }
    },
    //{ field: 'idAgency', headerName: 'ID Agencia', width: 120 },
    { field: 'agency', headerName: 'Agencia', width: 150 },
    { field: 'status', headerName: 'Estado', width: 120 }
  ];

  // Columna de gestión según rol
  const actionsColumn: GridColDef = {
    field: 'requestActions',
    headerName: 'Gestión',
    width: 150,
    sortable: false,
    renderCell: (params) => {
      const request = params.row as Request;

      // Director: botones de aprobar/rechazar
      if (user?.role === 'director') {
        const isValidate = request.status === 'VALIDADA';
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip title="Aprobar solicitud">
              <IconButton
                size="small"
                onClick={() => handleApprove(request.id)}
                disabled={!isValidate}
                sx={{
                  color: '#10b981',
                  '&:hover': { backgroundColor: '#d1fae5' },
                  '&:disabled': { color: '#d1d5db' }
                }}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Rechazar solicitud">
              <IconButton
                size="small"
                onClick={() => handleReject(request.id)}
                disabled={!isValidate}
                sx={{
                  color: '#ef4444',
                  '&:hover': { backgroundColor: '#fee2e2' },
                  '&:disabled': { color: '#d1d5db' }
                }}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      }

      // Manager: botón de crear grupo
      if (user?.role === 'manager') {
        const isCompleted = request.status === 'COMPLETADA';
        const isApproved = request.status === 'APROBADA';

        return (
          <Tooltip title={
            isCompleted ? 'Grupo ya creado' :
              isApproved ? 'Crear grupo' :
                'Solo disponible para solicitudes aprobadas'
          }>
            <span>
              <IconButton
                size="small"
                onClick={() => handleCreateGroup(request.id, request.groupName)}
                disabled={!isApproved}
                sx={{
                  color: isApproved ? '#4f46e5' : '#d1d5db',
                  '&:hover': { backgroundColor: '#eef2ff' },
                  '&:disabled': { color: '#d1d5db', cursor: 'not-allowed' }
                }}
              >
                <GroupAddIcon />
              </IconButton>
            </span>
          </Tooltip>
        );
      }

      // Aprendiz y Artista: boton para que los miembros acepten la solicitud
      if (user?.role === 'apprentice' || user?.role === 'artist') {
        const isPending = params.row.status === 'PENDIENTE';

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Tooltip title="Aceptar solicitud">
                <IconButton
                  size="small"
                  sx={{ color: '#10b981', '&:hover': { backgroundColor: '#d1fae5' } }}
                  onClick={() => handleAccept(params.row.id)}
                  disabled={!isPending}
                >
                  <CheckCircleIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Negar solicitud">
                <IconButton
                  size="small"
                  sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fee2e2' } }}
                  onClick={() => handleDeny(params.row.id)}
                  disabled={!isPending}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </div>
            {/* ...botones extra... */}
          </div>
        );
      }

      return null;
    }
  };

  // Agregar columna de acciones solo para director y manager
  const columns = user?.role === 'director' || user?.role === 'manager' || user?.role === 'apprentice' || user?.role === 'artist'
    ? [...baseColumns, actionsColumn]
    : baseColumns;

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'apprentice':
            endpoint = `/api/application?apprenticeId=${user.id}&agencyId=${user.agencyId}`;
            break;

          case 'artist':
            endpoint = `/api/application?artistId=${user.id}&agencyId=${user.agencyId}`;
            break;

          case 'manager':
          case 'director':
            endpoint = `/api/application?agencyId=${user.agencyId}`;
            break;

          case 'admin':
            endpoint = '/api/application';
            break;

          default:
            console.error('Rol no reconocido:', user.role);
            return;
        }

        // ============================================
        // SECCIÓN: BACKEND ENDPOINT
        // ============================================

        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener solicitudes');
        }

        const data = await response.json();
        const requestsArray = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

        console.log('array de solicitudes', requestsArray)

        let filteredRequests = requestsArray;
        // Filtrar solicitudes según rol y datos del usuario
        if (user.role === 'apprentice') {
          filteredRequests = requestsArray.filter(
            (req: any) =>
              Array.isArray(req.apprentices) &&
              req.apprentices.some((a: any) => a.apprenticeId === Number(user.profileData?.apprenticeId))
          );
        } else if (user.role === 'artist') {
          filteredRequests = requestsArray.filter(
            (req: any) =>
              Array.isArray(req.artists) &&
              req.artists.some(
                (a: any) =>
                  //console.log(a.idApprentice, user.profileData?.IdAp, a.groupId, user.profileData?.IdGr)
                  a.idApprentice === Number(user.profileData?.IdAp) &&
                  a.groupId === Number(user.profileData?.IdGr)
              )
          );
        } else if (user.role === 'manager' || user.role === 'director') {
          filteredRequests = requestsArray.filter(
            (req: any) =>
              req.idAgency === Number(user.agencyId) ||
              req.idAgency === Number(user.profileData?.agencyId)
          );
        }

        console.log('solicitudes filtradas:', filteredRequests)

        // Obtener nombres de agencia y concepto para cada solicitud
        //const formattedRequests = await Promise.all(requestsArray.map(async (req: any, index: number) => {
        const formattedRequests = await Promise.all(filteredRequests.map(async (req: any, index: number) => {
          // Obtener nombre de agencia
          let agencyName = req.agency?.name || '';
          if (!agencyName && req.idAgency) {
            agencyName = await fetchAgencyName(req.idAgency);
          }

          // Obtener nombre de concepto
          let conceptName = req.concept?.name || '';
          let conceptId = req.concept?.id || req.idConcept || req.concept;
          if (!conceptName && conceptId) {
            conceptName = await fetchConceptName(conceptId);
          }
          // Unir artistas y aprendices, asociar roles
          const artists = Array.isArray(req.artists) ? req.artists : [];
          const apprentices = Array.isArray(req.apprentices) ? req.apprentices : [];
          const roles = Array.isArray(req.roles) ? req.roles : [];
          const members = [...artists, ...apprentices].map((member, idx) => ({
            ...member,
            rol: roles[idx] || ''
          }));

          return {
            id: req.id || index,
            entityName: req.artist?.name || req.apprentice?.name || '',
            groupName: req.groupName || '',
            agency: agencyName,
            date: transformDate(req.date) || '',
            concept: conceptName,
            members,
            roles,
            idAgency: req.agencyId || '',
            status: req.status || '',
            type: req.type || '',
          };
        }));

        console.log('Solicitudes obtenidas del backend:', formattedRequests);
        setRequests(formattedRequests);

        //setRequests(formattedData);
      } catch (error) {
        console.error('Error al cargar solicitudes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const askDelete = (id: number) => {
    setRequestToDelete(id);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    if (requestToDelete === null) return;

    try {
      const response = await fetch(`http://localhost:3000/api/application/${requestToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar solicitud');
      }

      setRequests(prev => prev.filter(req => req.id !== requestToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar solicitud:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar solicitud');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setRequestToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: Request) => {
    try {
      const response = await fetch(`http://localhost:3000/api/application/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar solicitud');
      }

      const data = await response.json();
      setRequests(prev =>
        prev.map(req => req.id === updatedRow.id ? (data.data || data) : req)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar solicitud:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar solicitud');
      setOpenError(true);
    }
  };

  const handleCreateSave = async (newrequest: any) => {
    try {
      // Adaptar el payload según la estructura requerida
      const payload = {
        groupName: newrequest.groupName,
        idAgency: newrequest.agencyId || newrequest.idAgency,
        roles: Array.isArray(newrequest.roles) ? newrequest.roles : [],
        idConcept: newrequest.concept?.id || newrequest.idConcept || newrequest.concept,
        // Suponiendo que members contiene tanto aprendices como artistas
        apprentices: Array.isArray(newrequest.members)
          ? newrequest.members.filter((m: any) => m.type === 'apprentice').map((m: any) => m.id)
          : [],
        artists: Array.isArray(newrequest.members)
          ? newrequest.members.filter((m: any) => m.type === 'artist').map((m: any) => [m.idApprentice, m.groupId])
          : [],
        idApprentice: newrequest.idApprentice || undefined,
        idGroup: newrequest.idGroup || undefined
      };
      const url= user?.role === 'admin' ? 'http://localhost:3000/api/application' : 'http://localhost:3000/api/application/create'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al crear solicitud');
      }

      const data = await response.json();
      setRequests(prev => [...prev, (data.data || data)]);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al crear solicitud');
      setOpenError(true);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <PageLayout
      title="Solicitudes de Creación de Grupos"
      description={
        user.role === 'apprentice' || user.role === 'artist' ? 'Aquí puedes ver las solicitudes de creación de grupos. Envía nuevas solicitudes y consulta su flujo en la agencia' :
          user.role === 'manager' ? 'Mira todas las solicitudes de tu agencia.' :
            user.role === 'director' ? 'Revisa las solicitudes de tu agencia y supervisa el flujo de ellas.' :
              user.role === 'admin' ? 'Consulta y gestiona todas las solicitudes del sistema y realiza tareas administrativas cuando sea necesario.' :
                'Gestiona y consulta las solicitudes de creación de grupos'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando solicitudes...
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={requests}
          pagesize={10}
          onDelete={askDelete}
          onEditSave={handleEditSave}
          onCreateSave={handleCreateSave}
          showCreateButton={user.role === 'admin' || user.role === 'apprentice' || user.role === 'artist'}
          showEditButton={user.role === 'manager' || user.role === 'director' || user.role === 'admin'}
          constraints={requestConstraints}
          createEntity="request"
          userRole={user?.role}
        />
      )}
      <ConfirmDialog
        message="¿Está seguro que desea eliminar esta solicitud?"
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
    </PageLayout>
  );
};

export default Requests;