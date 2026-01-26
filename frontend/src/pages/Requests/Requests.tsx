import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip, Select, MenuItem, Typography } from '@mui/material';
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
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'VALIDADA',
        })
      });

      if (!response.ok) {
        throw new Error('Error al aprobar solicitud');
      }

      // Actualizar estado local
      setRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status: 'VALIDADA' } : req)
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
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          status: 'RECHAZADA',
        })
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
      const response = await fetch(`http://localhost:3000/api/application/createGroup/${requestId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
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
      console.log('========== INICIO handleAccept ==========');
      console.log('requestId:', requestId);
      console.log('user?.role:', user?.role);
      console.log('user?.id:', user?.id);
      console.log('user?.profileData:', user?.profileData);

      const isArtist = user?.role === 'artist';
      console.log('isArtist:', isArtist);

      const url = isArtist
        ? `http://localhost:3000/api/application/${requestId}/artist-decision`
        : `http://localhost:3000/api/application/${requestId}/apprentice-decision`;

      console.log('URL construida:', url);

      const body: any = {
        decision: true,
      };

      if (isArtist) {
        body.apprenticeId = user?.profileData?.IdAp;
        body.groupId = user?.profileData?.IdGr || user?.profileData?.groupId;
        console.log('Rol: ARTIST - apprenticeId:', body.apprenticeId, '- groupId:', body.groupId);
      } else {
        body.apprenticeId = user?.profileData?.apprenticeId || user?.profileData?.IdAp;
        console.log('Rol: APPRENTICE - apprenticeId:', body.apprenticeId);
      }

      console.log('Body final a enviar:', JSON.stringify(body, null, 2));
      console.log('Headers:', {
        'Authorization': `Bearer ${localStorage.getItem('token')?.substring(0, 20)}...`,
        'Content-Type': 'application/json',
      });

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      console.log('handleAccept - response.status:', response.status);
      console.log('handleAccept - response.statusText:', response.statusText);
      console.log('handleAccept - response.ok:', response.ok);

      // Leer respuesta del servidor
      let responseData: any;
      try {
        responseData = await response.json();
        console.log('handleAccept - responseData:', responseData);
      } catch (e) {
        console.log('No se pudo parsear respuesta como JSON');
        const text = await response.text();
        console.log('Respuesta texto:', text);
      }

      if (!response.ok) {
        console.error('Response no fue OK. Status:', response.status);
        throw new Error(`Error al aceptar solicitud - Status ${response.status}`);
      }

      console.log('✅ Solicitud aceptada correctamente');
      setSuccessMessage('Solicitud aceptada exitosamente');
      setOpenSuccess(true);

      // Recargar solicitudes después de aceptar
      const token = localStorage.getItem('token');
      const endpoint = user?.role === 'apprentice'
        ? `/api/application?apprenticeId=${user?.id}&agencyId=${user?.agencyId}`
        : `/api/application?artistId=${user?.id}&agencyId=${user?.agencyId}`;

      console.log('Reloading requests desde endpoint:', endpoint);

      const refreshResponse = await fetch(`http://localhost:3000${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('refreshResponse.status:', refreshResponse.status);

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        console.log('Datos recargados:', data);
        const requestsArray = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        setRequests(requestsArray);
        console.log('✅ Solicitudes reloaded correctamente');
      }

      console.log('========== FIN handleAccept EXITOSO ==========');
    } catch (error) {
      console.error('❌ Error al aceptar solicitud:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'sin stack');
      setErrorMessage('Error al aceptar solicitud');
      setOpenError(true);
      console.log('========== FIN handleAccept CON ERROR ==========');
    }
  };

  const handleDeny = async (requestId: number) => {
    const isArtist = user?.role === 'artist';
    const url = isArtist
      ? `http://localhost:3000/api/application/${requestId}/artist-decision`
      : `http://localhost:3000/api/application/${requestId}/apprentice-decision`;

    try {
      console.log('========== INICIO handleDeny ==========');
      console.log('requestId:', requestId);
      console.log('user?.role:', user?.role);
      console.log('isArtist:', isArtist);
      console.log('URL construida:', url);

      const body: any = {
        decision: false,
      };

      if (isArtist) {
        body.apprenticeId = user?.profileData?.IdAp || user?.profileData?.apprenticeId;
        body.groupId = user?.profileData?.IdGr || user?.profileData?.groupId;
        console.log('Rol: ARTIST - apprenticeId:', body.apprenticeId, '- groupId:', body.groupId);
      } else {
        body.apprenticeId = user?.profileData?.apprenticeId || user?.profileData?.IdAp;
        console.log('Rol: APPRENTICE - apprenticeId:', body.apprenticeId);
      }

      console.log('Body final a enviar:', JSON.stringify(body, null, 2));

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      console.log('handleDeny - response.status:', response.status);
      console.log('handleDeny - response.statusText:', response.statusText);
      console.log('handleDeny - response.ok:', response.ok);

      // Leer respuesta del servidor
      let responseData: any;
      try {
        responseData = await response.json();
        console.log('handleDeny - responseData:', responseData);
      } catch (e) {
        console.log('No se pudo parsear respuesta como JSON');
        const text = await response.text();
        console.log('Respuesta texto:', text);
      }

      if (!response.ok) {
        console.error('Response no fue OK. Status:', response.status);
        throw new Error(`Error al negar solicitud - Status ${response.status}`);
      }

      console.log('✅ Solicitud rechazada correctamente');
      setSuccessMessage('Solicitud rechazada exitosamente');
      setOpenSuccess(true);

      // Recargar solicitudes después de rechazar
      const token = localStorage.getItem('token');
      const endpoint = user?.role === 'apprentice'
        ? `/api/application?apprenticeId=${user?.id}&agencyId=${user?.agencyId}`
        : `/api/application?artistId=${user?.id}&agencyId=${user?.agencyId}`;

      console.log('Reloading requests desde endpoint:', endpoint);

      const refreshResponse = await fetch(`http://localhost:3000${endpoint}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('refreshResponse.status:', refreshResponse.status);

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        console.log('Datos recargados:', data);
        const requestsArray = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        setRequests(requestsArray);
        console.log('✅ Solicitudes reloaded correctamente');
      }

      console.log('========== FIN handleDeny EXITOSO ==========');
    } catch (error) {
      console.error('❌ Error al negar solicitud:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'sin stack');
      setErrorMessage('Error al rechazar solicitud');
      setOpenError(true);
      console.log('========== FIN handleDeny CON ERROR ==========');
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

  const GetAgencyByMember = async (idAp: number, idGr: number) => {

    const url = user?.role === 'artist' ? `http://localhost:3000/api/agency/by-member/${idAp}/${idGr}
    ` : `http://localhost:3000/api/agency/by-member/${idAp}`

    const agency = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await agency.json();
    console.log('agency data del request', data)
    return data.data
  };

  const handleCreateSave = async (newrequest: any) => {
    try {
      const idAp = user?.profileData?.IdAp || user?.profileData?.apprenticeId;
      const idGr = user?.profileData?.IdGr || user?.profileData?.groupId;


      console.log('newrequest', newrequest)
      // Separar miembros en apprentices y artists según el tipo, incluyendo los roles
      const members = Array.isArray(newrequest.members) ? newrequest.members : [];
      const apprentices = members
        .filter((m: any) => m.type === 'apprentice' && m.memberId && m.role)
        .map((m: any) => [Number(m.memberId), m.role]);
      const artists = members
        .filter((p: any) => p.type === 'artist' && p.memberId && p.role)
        .map((p: any) => {
          // Para artistas, memberId viene como "apprenticeId,groupId" (string)
          let apprenticeId = 0;
          let groupId = 0;
          
          // Parsear el string "apprenticeId,groupId"
          if (typeof p.memberId === 'string' && p.memberId.includes(',')) {
            const parts = p.memberId.split(',');
            apprenticeId = Number(parts[0]);
            groupId = Number(parts[1]);
          } else if (Array.isArray(p.memberId)) {
            apprenticeId = Number(p.memberId[0]);
            groupId = Number(p.memberId[1]);
          } else {
            // Fallback si no se puede parsear
            apprenticeId = Number(p.memberId) || 0;
            groupId = 0;
          }
          
          console.log(`[handleCreateSave] Artist ${p.memberId} parseado como [${apprenticeId}, ${groupId}]`);
          return [apprenticeId, groupId, p.role];
        });

      const agencyUser = await GetAgencyByMember(idAp, idGr);

      const payload: any = {
        groupName: newrequest.groupName || newrequest.name,
        idAgency: agencyUser.id, //user?.profileData?.agencyId || newrequest.idAgency || agency.agencyId,
        idConcept:  Number(newrequest.concept),
        idApprentice: idAp,
        idGroup: idGr
      };

      // Solo incluir apprentices si tiene elementos
      if (apprentices.length > 0) {
        payload.apprentices = apprentices;
      }

      // Solo incluir artists si tiene elementos
      if (artists.length > 0) {
        payload.artists = artists;
      }

      console.log('payload final', payload)
      console.log('user', user)
      const url = user?.role === 'admin' ? 'http://localhost:3000/api/application' : 'http://localhost:3000/api/application/create'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error del backend:', errorData);
        throw new Error(errorData?.error || `Error al crear solicitud (status ${response.status})`);
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
      field: 'memberRoles',
      headerName: 'Miembros & Roles',
      width: 220,
      renderCell: (params) => {
        const members = Array.isArray(params.row.members) ? params.row.members : [];

        if (members.length === 0) {
          return (
            <Typography variant="body2" color="text.secondary" sx={{ width: '100%', py: 1 }}>
              Sin miembros
            </Typography>
          );
        }

        // Extraer nombre y rol de cada miembro (artista o aprendiz)
        const membersList = members.map((member: any) => ({
          name: member.name || member.realName || 'Sin nombre',
          role: member.role ||member.rol|| 'Sin rol'
        }));
        console.log("membersList", membersList);

        return (
          <Select
            value=""
            displayEmpty
            sx={{ width: '100%', height: 40 }}
            renderValue={() => `${members.length} miembro${members.length !== 1 ? 's' : ''}`}
          >
            {membersList.map((item: any, index: number) => (
              <MenuItem key={index} value={index}>
                {item.name} - {item.role}
              </MenuItem>
            ))}
          </Select>
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
        const isValidate = request.status === 'APROBADO';
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
        const isApproved = request.status === 'VALIDADA';

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

  // Columna de estado de artista/aprendiz
  const statusColumn: GridColDef = {
    field: 'artistapprenticeStatus',
    headerName: 'Estado Individual',
    width: 150,
    sortable: false,
    renderCell: (params) => {
      const request = params.row as any;
      const members = Array.isArray(request.members) ? request.members : [];
      
      // Buscar el miembro que coincida con el usuario logueado
      let userStatus = '';
      let foundMember: any = null;
      
      
      const apprenticeId = user?.profileData?.apprenticeId || user.id;
      const idAp = user?.profileData?.IdAp;
      const idGr = user?.profileData?.IdGr;
      foundMember = user?.role==='apprentice' ? 
       members.find((m: any) => m.apprenticeId === Number(apprenticeId)) 
      :members.find((m: any) => m.idApprentice === Number(idAp) && m.groupId === Number(idGr)); ;
      if (foundMember) {
          userStatus = foundMember.status

      }
   
      
      if (!foundMember) {
        console.log(`Miembro no encontrado en solicitud ${request.id}. Members:`, members);
      }
      
      return userStatus || '-';
    }
  };

  // Agregar columna de acciones y estado según rol
  const columns = user?.role === 'director' || user?.role === 'manager' || user?.role === 'apprentice' || user?.role === 'artist'
    ? [...baseColumns, actionsColumn, ...(user?.role === 'apprentice' || user?.role === 'artist' ? [statusColumn] : [])]
    : baseColumns;

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        console.log('========== INICIO fetchRequests ==========');
        if (!user) {
          console.log('No hay usuario, retornando');
          return;
        }

        console.log('Usuario actual:', {
          id: user.id,
          role: user.role,
          agencyId: user.agencyId,
          profileData: user.profileData
        });

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

        console.log('Endpoint construido:', endpoint);

        // ============================================
        // SECCIÓN: BACKEND ENDPOINT
        // ============================================

        const token = localStorage.getItem('token');
        console.log('Token presente:', !!token);

        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener solicitudes - Status ${response.status}`);
        }

        const data = await response.json();
        console.log('Data recibida del backend:', data);

        const requestsArray = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        console.log('Array de solicitudes extraído:', requestsArray);

        let filteredRequests = requestsArray;

        // Filtrar solicitudes según rol y datos del usuario
        if (user.role === 'apprentice') {
          console.log('Filtrando por APPRENTICE');
          const apprenticeId = user.profileData?.apprenticeId;
          console.log('apprenticeId a filtrar:', apprenticeId);

          filteredRequests = requestsArray.filter(
            (req: any) => {
              const hasApprentices = Array.isArray(req.apprentices);
              const matches = hasApprentices && req.apprentices.some((a: any) => a.apprenticeId === Number(apprenticeId));
              console.log(`Solicitud ${req.id}: hasApprentices=${hasApprentices}, matches=${matches}`);
              return matches;
            }
          );
        } else if (user.role === 'artist') {
          console.log('Filtrando por ARTIST');
          const idAp = user.profileData?.IdAp;
          const idGr = user.profileData?.IdGr;
          console.log('idAp a filtrar:', idAp, 'idGr a filtrar:', idGr);

          filteredRequests = requestsArray.filter(
            (req: any) => {
              const hasArtists = Array.isArray(req.artists);
              const matches = hasArtists && req.artists.some(
                (a: any) => {
                  const idApprenticeMatch = a.idApprentice === Number(idAp);
                  const groupIdMatch = a.groupId === Number(idGr);
                  console.log(`  Solicitud ${req.id} - Artist: idApprentice=${a.idApprentice} (match=${idApprenticeMatch}), groupId=${a.groupId} (match=${groupIdMatch})`);
                  return idApprenticeMatch && groupIdMatch;
                }
              );
              console.log(`Solicitud ${req.id}: hasArtists=${hasArtists}, matches=${matches}`);
              return matches;
            }
          );
        } else if (user.role === 'manager' || user.role === 'director') {
          console.log('Filtrando por MANAGER/DIRECTOR');
          const agencyIdToMatch = user.agencyId || user.profileData?.agencyId;
          console.log('agencyId a filtrar:', agencyIdToMatch);

          filteredRequests = requestsArray.filter(
            (req: any) => {
              const matches = req.idAgency === Number(agencyIdToMatch) || req.idAgency === Number(user.profileData?.agencyId);
              console.log(`Solicitud ${req.id}: idAgency=${req.idAgency}, match=${matches}`);
              return matches;
            }
          );
        }

        console.log('Solicitudes después del filtrado:', filteredRequests.length);

        // Obtener nombres de agencia y concepto para cada solicitud
        const formattedRequests = await Promise.all(filteredRequests.map(async (req: any, index: number) => {
          console.log(`Formateando solicitud ${req.id}...`);

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

          // Unir artistas y aprendices
          const artists = Array.isArray(req.artists) ? req.artists : [];
          const apprentices = Array.isArray(req.apprentices) ? req.apprentices : [];
          const members = [...artists, ...apprentices];
          
          console.log("artists solicitud", artists);
          console.log("apprentices solicitud", apprentices);
          console.log("members solicitud", members);

          return {
            id: req.id || index,
            entityName: req.artist?.name || req.apprentice?.name || '',
            groupName: req.groupName || '',
            agency: agencyName,
            date: transformDate(req.date) || '',
            concept: conceptName,
            members,
            idAgency: req.agencyId || '',
            status: req.status || '',
            type: req.type || '',
          };
        }));

        console.log('Solicitudes formateadas:', formattedRequests);
        console.log('Cantidad final de solicitudes:', formattedRequests.length);
        setRequests(formattedRequests);
        console.log('✅ fetchRequests completado exitosamente');
        console.log('========== FIN fetchRequests ==========');
      } catch (error) {
        console.error('❌ Error al cargar solicitudes:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'sin stack');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

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