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

interface Contract {
  id: number;
  artistName: string;
  groupName?: string;
  contractType: 'exclusive' | 'non_exclusive' | 'production' | 'distribution';
  startDate: string;
  endDate: string;
  value: number;
  status: 'active' | 'expired' | 'terminated' | 'pending';
  agencyName: string;
  terms?: string;
}

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
            <span style={{color: '#6b7280', fontSize: '13px', fontWeight: 500, marginLeft: 8}}>[{tipo}]</span>
          </span>
        );
      }
    },
    { field: 'agencyName', headerName: 'Agencia', width: 180 },
    { field: 'startDate', headerName: 'Fecha Inicio', width: 150, valueFormatter: (params) => new Date(params).toLocaleDateString('es-ES') },
    { field: 'status', headerName: 'Estado', width: 120 },
    { field: 'initialConditions', headerName: 'Términos Iniciales', width: 220 },
    { field: 'incomeDistribution', headerName: 'Distribución de Ingresos', width: 180 }
  ];

  // Agregar columna de agencia solo para admin
  const columns = baseColumns;

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'manager':
            endpoint = `/api/contract?agencyId=${user.agencyId}`;
            break;
          case 'director':
            endpoint = `/api/contract?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/contract';
            break;
          default:
            console.error('Rol no autorizado:', user.role);
            return;
        }

        // ============================================
        // SECCIÓN: BACKEND ENDPOINT
        // Descomenta esta sección para usar el backend real
        // ============================================
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener contratos');
        }

        const data = await response.json();
        const contractsArray = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        const formattedContracts = contractsArray.map((contract: any, index: number) => ({
          id: index,
          type: contract.type,
          entityName: contract.type === 'Artist' ? contract.artist?.ArtistName : contract.group?.name,
          agencyName: contract.agency?.name,
          startDate: contract.startDate,
          status: contract.status,
          initialConditions: contract.initialConditions,
          incomeDistribution: contract.incomeDistribution
        }));
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

  const handleEditSave = async (updatedRow: Contract) => {
    try {
      // PUT /api/contract - Sin autenticación, id en body
      const response = await fetch(`http://localhost:3000/api/contract`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar contrato');
      }

      const data = await response.json();
      setContracts(prev =>
        prev.map(contract => contract.id === updatedRow.id ? (data.data || data) : contract)
      );
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
          } catch (e) {}
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

  if (!user) {
    return <div>Cargando...</div>;
  }

  if (user.role !== 'manager' && user.role !== 'director' && user.role !== 'admin') {
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
            constraints={contractConstraints}
            createEntity="contract"
            userRole={user?.role}
            // onCreateClick={() => setShowCreateModal(true)}
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
            message="¿Está seguro de que desea eliminar este contrato?"
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
        </>
      )}
    </PageLayout>
  );
};

export default Contracts;
