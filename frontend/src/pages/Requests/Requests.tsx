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

interface Request {
  id: number;
  apprenticeName: string;
  groupName: string;
  status: string;
  createdAt: string;
  agencyName?: string;
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

  // Manejar aprobación de solicitud (Director)
  const handleApprove = async (id: number) => {
    try {
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
      console.log('Solicitud aprobada exitosamente:', id);
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

  // Columnas del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'apprenticeName', headerName: 'Aprendiz', width: 180 },
    { field: 'groupName', headerName: 'Nombre del Grupo', width: 180 },
    {
      field: 'createdAt',
      headerName: 'Fecha de Solicitud',
      width: 150,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
    { field: 'agencyName', headerName: 'Agencia', width: 150 },
    {
      field: 'status',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => {
        const statusColors: Record<string, string> = {
          'pending': '#f59e0b',
          'approved': '#10b981',
          'rejected': '#ef4444',
          'completed': '#6366f1'
        };
        return (
          <span style={{
            color: statusColors[params.value] || '#6b7280',
            fontWeight: 600
          }}>
            {params.value === 'pending' ? 'Pendiente' :
              params.value === 'approved' ? 'Aprobada' :
                params.value === 'rejected' ? 'Rechazada' :
                  params.value === 'completed' ? 'Finalizada' : params.value}
          </span>
        );
      }
    }
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
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip title="Aprobar solicitud">
              <IconButton
                size="small"
                onClick={() => handleApprove(request.id)}
                disabled={request.status !== 'pending'}
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
                disabled={request.status !== 'pending'}
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
        const isCompleted = request.status === 'completed';
        const isApproved = request.status === 'approved';

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
            // Solicitudes del aprendiz específico en su agencia
            endpoint = `/api/application?apprenticeId=${user.id}&agencyId=${user.agencyId}`;
            break;

          case 'artist':
            // Solicitudes del artista específico en su agencia
            endpoint = `/api/application?artistId=${user.id}&agencyId=${user.agencyId}`;
            break;

          case 'manager':
            // Todas las solicitudes de la agencia del manager
            endpoint = `/api/application?agencyId=${user.agencyId}`;
            break;

          case 'director':
            // Todas las solicitudes de la agencia del director
            endpoint = `/api/application?agencyId=${user.agencyId}`;
            break;

          case 'admin':
            // TODO: Implementar más adelante - todas las solicitudes del sistema
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
        setRequests(data.data || data);
        
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

        // ============================================
        // SECCIÓN: DATOS DEMO
        //============================================
        /*
        const mockRequests: Request[] = [
          {
            id: 1,
            apprenticeName: 'Kim Ji-soo',
            groupName: 'Starlight',
            status: 'pending',
            createdAt: '2025-11-25T10:00:00',
            agencyName: 'K-Pop Stars Agency'
          },
          {
            id: 2,
            apprenticeName: 'Lee Min-ho',
            groupName: 'Phoenix',
            status: 'approved',
            createdAt: '2025-11-20T15:30:00',
            agencyName: 'K-Pop Stars Agency'
          },
          {
            id: 3,
            apprenticeName: 'Park Soo-young',
            groupName: 'Dreamers',
            status: 'rejected',
            createdAt: '2025-11-18T09:15:00',
            agencyName: 'Global Entertainment'
          }
        ];

        // Filtrar según rol para la demo
        let filteredRequests = mockRequests;
        if (user.role === 'apprentice') {
          filteredRequests = mockRequests.filter(r => r.id === 1);
        } else if (user.role === 'artist') {
          filteredRequests = mockRequests.filter(r => r.id <= 2);
        }

        setRequests(filteredRequests);
        */
        // ============================================
        // FIN SECCIÓN: DATOS DEMO
        // ============================================ 

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
      const response = await fetch(`http://localhost:3000/api/requests/${requestToDelete}`, {
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
      const response = await fetch(`http://localhost:3000/api/requests/${updatedRow.id}`, {
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
      const response = await fetch('http://localhost:3000/api/requests', {
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
        message="¿Está seguro de que desea eliminar esta solicitud?"
        open={openConfirm}
        onConfirm={handleDelete}
        onCancel={() => setOpenConfirm(false)}
      />
      <ConfirmDialog
        title="¡Éxito!"
        message="Operación realizada correctamente"
        open={openAccept}
        onConfirm={() => setOpenAccept(false)}
        onCancel={() => setOpenAccept(false)}
        showDeleteButton={false}
      />
      <ConfirmDialog
        title="Error"
        message={errorMessage}
        open={openError}
        onConfirm={() => setOpenError(false)}
        onCancel={() => setOpenError(false)}
        showDeleteButton={false}
      />
    </PageLayout>
  );
};

export default Requests;
