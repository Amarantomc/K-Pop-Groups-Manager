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
import Modal from '../../components/modal/Modal';

interface Request {
  id: number;
  entityName: string;
  groupName: string;
  agency: string;
  idAgency?: string; // <-- para lógica de agencia
  date: string;
  concept: string;
  members: string[];
  roles: string[];
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
  const [openContractModal, setOpenContractModal] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null);

  // Constraints para el contrato (ajusta según tus campos reales)
  const contractConstraints = {
    groupName: { editable: true, required: true, type: 'string' as 'string', label: 'Nombre del Grupo' },
    startDate: { editable: true, required: true, type: 'date' as 'date', label: 'Fecha de Inicio' },
    endDate: { editable: true, required: true, type: 'date' as 'date', label: 'Fecha de Fin' },
    salary: { editable: true, required: true, type: 'number' as 'number', label: 'Salario' },
    // Agrega más campos según tu modelo de contrato
  };

  // Manejar aprobación de solicitud (Director)
  const handleApprove = async (id: number) => {
    try {
      // 1. Cambiar estado a 'aprobado'
      const response = await fetch(`http://localhost:3000/api/application/${id}/approve`, {
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
        prev.map(req => req.id === id ? { ...req, status: 'approved' } : req)
      );
      // 2. Abrir modal de contrato
      setCurrentRequestId(id);
      setOpenContractModal(true);
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
    }
  };

  // Manejar rechazo de solicitud (Director)
  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/application/${id}/reject`, {
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
        prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req)
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

  // Guardar contrato (envía al backend y cambia estado a 'negociacion')
  const handleSaveContract = async (formData: any) => {
    if (!currentRequestId) return;
    try {
      // 1. Crear contrato
      const contractRes = await fetch('http://localhost:3000/api/contract', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, requestId: currentRequestId })
      });
      if (!contractRes.ok) throw new Error('Error al crear contrato');
      // 2. Cambiar estado de solicitud a 'negociacion'
      const updateRes = await fetch(`http://localhost:3000/api/application/${currentRequestId}/negotiation`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!updateRes.ok) throw new Error('Error al actualizar solicitud a negociacion');
      setRequests(prev => prev.map(req => req.id === currentRequestId ? { ...req, status: 'negociacion' } : req));
      setOpenContractModal(false);
      setCurrentRequestId(null);
    } catch (error) {
      console.error('Error al crear contrato o actualizar solicitud:', error);
    }
  };

  // Columnas del DataTable
  const baseColumns: GridColDef[] = [
    //{ field: 'id', headerName: 'ID', width: 70 },
    { field: 'groupName', headerName: 'Nombre de Grupo', width: 150 },
    {
      field: 'entityName',
      headerName: 'Aprendiz/Artista',
      width: 150,
      renderCell: (params) => {
        const tipo = params.row.type === 'Artist' ? 'Artista' : params.row.type === 'Apprentice' ? 'Aprendiz' : '';
        const color = params.row.type === 'Artist' ? '#2563eb' : params.row.type === 'Apprentice' ? '#10b981' : '#6b7280';
        return (
          <span>
            <span style={{ color, fontWeight: 600 }}>{params.value || ''}</span>
            {tipo && (
              <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500, marginLeft: 8 }}>[{tipo}]</span>
            )}
          </span>
        );
      }
    },
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


      // Verificar si la solicitud pertenece a la agencia del usuario
      const userAgencyId = user?.agencyId;
      // Puede venir como request.agency (nombre) o request.idAgency (id)
      // Usamos idAgency para la lógica
      const requestAgencyId = request.idAgency;
      const isSameAgency = userAgencyId && requestAgencyId && String(userAgencyId) === String(requestAgencyId);

      // Director: botones de aprobar/rechazar SOLO si es su agencia y estado pendiente
      if (user?.role === 'director') {
        const isPending = request.status === 'pending';
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip title={isSameAgency && isPending ? 'Aprobar solicitud' : 'Solo solicitudes pendientes de tu agencia'}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleApprove(request.id)}
                  disabled={!(isSameAgency && isPending)}
                  sx={{
                    color: '#10b981',
                    '&:hover': { backgroundColor: '#d1fae5' },
                    '&:disabled': { color: '#d1d5db' }
                  }}
                >
                  <CheckCircleIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={isSameAgency && isPending ? 'Rechazar solicitud' : 'Solo solicitudes pendientes de tu agencia'}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => handleReject(request.id)}
                  disabled={!(isSameAgency && isPending)}
                  sx={{
                    color: '#ef4444',
                    '&:hover': { backgroundColor: '#fee2e2' },
                    '&:disabled': { color: '#d1d5db' }
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </span>
            </Tooltip>
          </div>
        );
      }

      // Manager: botón de crear grupo SOLO si es su agencia y estado aprobado
      if (user?.role === 'manager') {
        const isCompleted = request.status === 'completed';
        const isApproved = request.status === 'approved';
        return (
          <Tooltip title={
            !isSameAgency ? 'Solo solicitudes de tu agencia' :
            isCompleted ? 'Grupo ya creado' :
            isApproved ? 'Crear grupo' :
            'Solo disponible para solicitudes aprobadas'
          }>
            <span>
              <IconButton
                size="small"
                onClick={() => handleCreateGroup(request.id, request.groupName)}
                disabled={!(isSameAgency && isApproved)}
                sx={{
                  color: isSameAgency && isApproved ? '#4f46e5' : '#d1d5db',
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

      return null;
    }
  };

  // Agregar columna de acciones solo para director y manager
  const columns = user?.role === 'director' || user?.role === 'manager'
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

        // Obtener nombres de agencia y concepto para cada solicitud
        const formattedRequests = await Promise.all(requestsArray.map(async (req: any, index: number) => {
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
        // Filtrado según el rol
        let filteredRequests = formattedRequests;
        if (user.role === 'director' || user.role === 'manager') {
          filteredRequests = formattedRequests.filter(req => String(req.idAgency) === String(user.agencyId));
        } else if (user.role === 'artist') {
          filteredRequests = formattedRequests.filter(req => req.members.some((m: { id: string | number }) => String(m.id) === String(user.id)));
        } else if (user.role === 'apprentice') {
          filteredRequests = formattedRequests.filter(req => req.members.some((m: { id: string | number }) => String(m.id) === String(user.id)));
        }
        // admin ve todas
        setRequests(filteredRequests);

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
      const response = await fetch(`http://localhost:3000/api//${requestToDelete}`, {
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
      const response = await fetch(`http://localhost:3000/api//${updatedRow.id}`, {
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

  const handleCreateSave = async (newRow: Omit<Request, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3000/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRow)
      });

      if (!response.ok) {
        throw new Error('Error al crear solicitud');
      }

      const data = await response.json();
      setRequests(prev => [...prev, (data.data || data)]);
    } catch (error) {
      console.error('Error al crear solicitud:', error);
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
      {/* Modal para crear contrato al aprobar solicitud */}
      <Modal
        isOpen={openContractModal}
        onClose={() => setOpenContractModal(false)}
        title="Crear Contrato"
        constraints={contractConstraints}
        onSave={handleSaveContract}
      />
    </PageLayout>
  );
};

export default Requests;
