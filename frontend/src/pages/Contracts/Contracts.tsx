import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import { useAuth } from '../../contexts/auth/AuthContext';
import { contractFields } from '../../config/formSource';
import { contractConstraints } from '../../config/modalConstraints';

// interface Contract {
//   id: number;
//   artistName: string;
//   groupName?: string;
//   contractType: 'exclusive' | 'non_exclusive' | 'production' | 'distribution';
//   startDate: string;
//   endDate: string;
//   value: number;
//   status: 'active' | 'expired' | 'terminated' | 'pending';
//   agencyName: string;
//   terms?: string;
// }

const Contracts: React.FC = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // Para aceptar/rechazar contrato (líder de grupo)
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Columnas base del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'type', headerName: 'Tipo de Contrato', width: 150 },
    {
      field: 'entityName',
      headerName: 'Artista/Grupo',
      width: 220,
      renderCell: (params) => {
        // params.row.type puede ser 'Artist' o 'Group'
        const tipo = params.row.type === 'Artist' ? 'Artista' : params.row.type === 'Group' ? 'Grupo' : 'Desconocido';
        const color = params.row.type === 'Artist' ? '#2563eb' : params.row.type === 'Group' ? '#10b981' : '#6b7280';
        return (
          <span>
            <span style={{ color, fontWeight: 600 }}>{params.value}</span>
            <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500, marginLeft: 8 }}>[{tipo}]</span>
          </span>
        );
      }
    },
    { field: 'agencyName', headerName: 'Agencia', width: 180 },
    { field: 'startDate', headerName: 'Fecha Inicio', width: 150, valueFormatter: (params) => new Date(params).toLocaleDateString('es-ES') },
    { field: 'status', headerName: 'Estado', width: 120 },
    { field: 'incomeDistribution', headerName: 'Distribución de Ingresos', width: 180 }
  ];

  // Lógica para mostrar botones de aceptar/rechazar solo al líder de grupo
  let columns = baseColumns;
  if (user && user.role === 'artist') {
    columns = [
      ...baseColumns,
      {
        field: 'groupLeaderActions',
        headerName: 'Acción Líder',
        width: 220,
        renderCell: (params: any) => {
        
          // Solo mostrar si el contrato es de grupo, el usuario es líder y el estado es 'negociacion'
          const isArtistContract = params.row.type === 'Artist'
          const isGroupContract = params.row.type === 'Group';
          const isNegotiation = params.row.status === 'Pendiente';

          const groupMembers = params.row.group?.members || [];

            const userAsMember = groupMembers.find((member: any) => 
          member.apprenticeId === user.profileData?.IdAp
        );

          const isGroupLeader = userAsMember?.rol === 'LIDER'

          const showDecisionArtist = isArtistContract && isNegotiation
          const showDecisionGroup = isGroupContract && isGroupLeader
          // const isGroupLeader = row.group.members
          // Estilos para botones habilitados vs deshabilitados
          const acceptButtonStyle = {
            marginRight: 8,
            border: 'none',
            borderRadius: 4,
            padding: '4px 10px',
            cursor: showDecisionArtist || showDecisionGroup ? 'pointer' : 'not-allowed',
            background: showDecisionArtist || showDecisionGroup ? '#10b981' : '#d1d5db',
            color: showDecisionArtist || showDecisionGroup ? 'white' : '#6b7280',
            opacity: showDecisionArtist || showDecisionGroup ? 1 : 0.7
          };

          const rejectButtonStyle = {
            border: 'none',
            borderRadius: 4,
            padding: '4px 10px',
            cursor: showDecisionArtist || showDecisionGroup ? 'pointer' : 'not-allowed',
            background: showDecisionArtist || showDecisionGroup ? '#ef4444' : '#d1d5db',
            color: showDecisionArtist || showDecisionGroup ? 'white' : '#6b7280',
            opacity: showDecisionArtist || showDecisionGroup ? 1 : 0.7
          };
          // const isUserGroupLeader = user.profileData?.groupId && params.row.entityId === user.profileData.groupId && user.permissions.includes('group_leader');
          //Caso para mostrar el aceptar ,rechazar
          return (
            <>
              <button
                style={acceptButtonStyle}
                disabled={(!showDecisionArtist && !showDecisionGroup) || processingId === params.row.id}
                onClick={() => handleAcceptContract(params.row, true)}
                title={!isNegotiation ? "Solo disponible para contratos Pendientes" : ""}
              >Aceptar</button>
              <button
                style={rejectButtonStyle}
                disabled={(!showDecisionArtist && !showDecisionGroup) || processingId === params.row.id}
                onClick={() => handleAcceptContract(params.row, false)}
                title={!isNegotiation ? "Solo disponible para contratos Pendientes" : ""}
              >Rechazar</button>
            </>
          );
        }
      }
    ];
  }

  // Funciones para aceptar/rechazar contrato
  //Falta ver como se actualizan los contratos
  const handleAcceptContract = async (row: any,decision:boolean) => {
    setProcessingId(row.id);
    try {
         const payload = {
          agencyId : row.agencyId,
          agencyName : row.agencyName,
          apprenticeId : row.apprenticeId,
          groupId : row.groupId,
          id :row.id,
          incomeDistribution : row.incomeDistribution,
          initialConditions : row.initialConditions,
          status : decision === true? 'ACEPTADO':'RECHAZADO',
          entityName : row.entityName,
          type : row.type,
          startDate : row.startDate? formatDate(row.startDate) : null
        }
      // Llama al endpoint para aprobar el contrato y la solicitud asociada
      const response = await fetch(`http://localhost:3000/api/contract`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          payload
        )
      });
      if (!response.ok) throw new Error('Error al aprobar el contrato');
      // Actualiza el estado local
       const data = await response.json();
      const updatedContract = {
  ...(data.data || data),
  id: payload.id,
  agencyName: payload.agencyName, // 👈 aseguramos el id
  entityName: payload.entityName // 👈 mantenemos el nombre del artista/grupo
};

setContracts(prev =>
  prev.map(contract =>
    contract.id === row.id ? updatedContract : contract
  )
); 
      setOpenAccept(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al aprobar contrato');
      setOpenError(true);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectContract = async (row: any) => {
    setProcessingId(row.id);
    try {
      // Llama al endpoint para rechazar el contrato y la solicitud asociada
      const response = await fetch(`http://localhost:3000/api/contract/${row.id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Error al rechazar el contrato');
      setContracts(prev => prev.map(c => c.id === row.id ? { ...c, status: 'terminated' } : c));
      setOpenAccept(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al rechazar contrato');
      setOpenError(true);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      try {
        if (!user) return;


        // ============================================
        // SECCIÓN: BACKEND ENDPOINT
        // ============================================
        const response = await fetch(`http://localhost:3000/api/contract`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener contratos');
        }

        const data = await response.json();
        const contractsArray = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        console.log('contractsArray',contractsArray)

        let filteredContracts = contractsArray;
    
        // Filtrar contratos según rol
        switch (user.role) {
          case 'admin':
            break;
          case 'manager':
          case 'director':
            // Manager y Director ven todos los contratos (Artist y Group) de su agencia
            const agencyIdToMatch = user.agencyId || user.profileData?.agencyId;
            console.log('AgencyId a buscar:', agencyIdToMatch);
            
            filteredContracts = contractsArray.filter((contract: any) => {
              const contractAgencyId = contract.agency?.id;
              console.log('Contrato - type:', contract.type, 'agencyId:', contractAgencyId, 'Match:', contractAgencyId === Number(agencyIdToMatch) || contractAgencyId === agencyIdToMatch);
              return contractAgencyId === Number(agencyIdToMatch) || contractAgencyId === agencyIdToMatch;
            });
            console.log('Contratos filtrados para manager/director:', filteredContracts);
            break;
          case 'artist':
            // Artista ve contratos donde está involucrado (individuales o de grupo)
            const artistIdAp = user.profileData?.IdAp;
            const artistIdGr = user.profileData?.IdGr;
            console.log('Filtrando contratos para artista - IdAp:', artistIdAp, 'IdGr:', artistIdGr);

            filteredContracts = contractsArray.filter((contract: any) => {
              // Contratos individuales del artista
              const isIndividualContract = (
                contract.type === 'Artist' &&
                contract.artist?.ApprenticeId === Number(artistIdAp) &&
                contract.artist?.GroupId === Number(artistIdGr)
              );
              
              // Contratos de grupo donde el artista está en ese grupo
              const isGroupContract = (
                contract.type === 'Group' &&
                Array.isArray(contract.group?.members) &&
                contract.group.members.some((member: any) => 
                  member.apprenticeId === Number(artistIdAp) && 
                  member.groupId === Number(artistIdGr)
                )
              );
              
              console.log('Contrato:', contract.type, 'Individual:', isIndividualContract, 'Group:', isGroupContract);
              return isIndividualContract || isGroupContract;
            });
            break;
          default:
            console.error('Rol no reconocido:', user.role);
            return;
        }
        console.log('filtrados roles',filteredContracts)

        const formattedContracts = filteredContracts.map((contract: any, index: number) => ({
          id: contract.id?? index,
          type: contract.type,
          entityName: contract.type === 'Artist' ? contract.artist?.ArtistName : contract.group?.name,
          agencyName: contract.agency?.name,
          agencyId: contract.agency?.id,
          apprenticeId: contract.artist?.ApprenticeId,
          groupId: contract.type === 'Artist'? contract.artist?.GroupId: contract.group?.id,
          startDate: contract.startDate,
          status: contract.status,
          initialConditions: contract.initialConditions,
          incomeDistribution: contract.incomeDistribution
        }));

        console.log('formattedContracts',formattedContracts)

        setContracts(formattedContracts);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

      } catch (error) {
        console.error('Error al cargar contratos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [user]);

  const askDelete = (id: number) => {
    setContractToDelete(id);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    if (contractToDelete === null) return;

    try {
      // DELETE /api/contract - Sin autenticación, id en query param o body
      const response = await fetch(`http://localhost:3000/api/contract?id=${contractToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar contrato');
      }

      setContracts(prev => prev.filter(contract => contract.id !== contractToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar contrato:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar contrato');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setContractToDelete(null);
    }
  };

  const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    console.error('Fecha inválida:', dateString);
    throw new Error('Fecha inválida');
  }
  
  // Obtener componentes de fecha LOCAL (no UTC)
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');
  
  // Formato: YYYY-MM-DD HH:MM:SS (mantiene hora local)
  // return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  
  // O si prefieres formato ISO pero con hora local:
   return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
};
  const handleEditSave = async (updatedRow: any) => {
    try {
      // PUT /api/contract - Sin autenticación, id en body
      console.log('updatedRow',updatedRow)
        const payload = {
          agencyId : updatedRow.agencyId,
          agencyName : updatedRow.agencyName,
          apprenticeId : updatedRow.apprenticeId,
          groupId : updatedRow.groupId,
          id :updatedRow.id,
          incomeDistribution : updatedRow.incomeDistribution,
          initialConditions : updatedRow.initialConditions,
          status : updatedRow.status,
          entityName : updatedRow.entityName,
          type : updatedRow.type,
          startDate : updatedRow.startDate? formatDate(updatedRow.startDate) : null
        }
      const response = await fetch(`http://localhost:3000/api/contract`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar contrato');
      }

      const data = await response.json();
      const updatedContract = {
  ...(data.data || data),
  id: payload.id,
  agencyName: payload.agencyName, // 👈 aseguramos el id
  entityName: payload.entityName // 👈 mantenemos el nombre del artista/grupo
};

setContracts(prev =>
  prev.map(contract =>
    contract.id === updatedRow.id ? updatedContract : contract
  )
); 
      // setContracts(prev =>
      //   prev.map(contract => contract.id === updatedRow.id ? (data.data || data) : contract)
      // );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar contrato:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar contrato');
      setOpenError(true);
    }
  };

  const handleCreateSave = (data: any) => {
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else Object.assign(payload, data);

    (async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const url = `${API_BASE}/api/contract`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear contrato';
          try {
            const txt = await res.text();
            try { const j = JSON.parse(txt); msg = j?.message || j?.error || txt || msg; }
            catch { msg = txt || msg; }
          } catch (e) { }
          console.error('Error al crear contrato:', msg);
          return;
        }

        const result = await res.json().catch(() => null);
        if (result?.data) {
          setContracts(prev => [...prev, result.data]);
        }
        setOpenAccept(true);
      } catch (err) {
        console.error('Error creando contrato:', err);
      }
    })();
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:3000/api/contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear contrato');
      }

      const data = await response.json();
      setContracts(prev => [...prev, (data.data || data)]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear contrato:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear contrato';
      setErrorMessage(errorMsg);
      setShowCreateModal(false);
      setOpenError(true);
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/export/contracts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al exportar PDF');
      }


      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);


      const a = document.createElement('a');
      a.href = url;
      a.download = 'contratos.pdf';
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al exportar PDF'
      );
      setOpenError(true);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  // Permitir acceso a artistas (líderes de grupo) para aceptar/rechaz
  if (
    user.role !== 'manager' &&
    user.role !== 'director' &&
    user.role !== 'admin' &&
    user.role !== 'artist'
    // !(user.role === 'artist' && user.profileData?.groupId && user.permissions.includes('group_leader'))
  ) {
    return (
      <PageLayout title="Contratos" description="No tienes permisos para ver esta página">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tienes acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gestión de Contratos"
      description={
        user.role === 'manager' ? 'Administra todos los contratos de los artistas de tu agencia' :
          user.role === 'director' ? 'Supervisa todos los contratos de la agencia' :
            user.role === 'admin' ? 'Vista global de todos los contratos del sistema' :
              'Gestión de contratos'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando contratos...
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={contracts}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            showEditButton={true}
            onExport={handleExportPdf}
            //showCreateButton={false}
            constraints={contractConstraints}
            createEntity="contract"
            userRole={user?.role}
            showCreateButton={false}
          />
          <ModalCreate
            isOpen={showCreateModal}
            title="Crear Contrato"
            createFields={contractFields}
            onSave={handleFormSubmit}
            onClose={() => setShowCreateModal(false)}
          />
          <Modal
            isOpen={showSuccessModal}
            title="Contrato creado exitosamente"
            onSave={() => setShowSuccessModal(false)}
            onClose={() => setShowSuccessModal(false)}
          />
          <ConfirmDialog
            message="¿Está seguro que desea eliminar este contrato?"
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={handleDelete}
            type="confirm"
          />
          <ConfirmDialog
            title="¡Éxito!"
            message="El contrato ha sido registrado correctamente"
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
};

export default Contracts;