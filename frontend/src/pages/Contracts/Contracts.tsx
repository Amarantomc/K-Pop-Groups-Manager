import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../contexts/auth/AuthContext';

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

  // Columnas base del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'artistName', headerName: 'Artista', width: 180 },
    { field: 'groupName', headerName: 'Grupo', width: 150 },
    {
      field: 'contractType',
      headerName: 'Tipo de Contrato',
      width: 160,
      renderCell: (params) => {
        const typeLabels: Record<string, string> = {
          'exclusive': 'Exclusivo',
          'non_exclusive': 'No Exclusivo',
          'production': 'Producción',
          'distribution': 'Distribución'
        };
        return typeLabels[params.value] || params.value;
      }
    },
    {
      field: 'startDate',
      headerName: 'Fecha Inicio',
      width: 130,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
    {
      field: 'endDate',
      headerName: 'Fecha Fin',
      width: 130,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
    {
      field: 'value',
      headerName: 'Valor',
      width: 140,
      renderCell: (params) => {
        const value = params.value as number;
        return (
          <span style={{
            color: '#10b981',
            fontWeight: 700,
            fontSize: '15px'
          }}>
            ${value.toLocaleString('es-ES')}
          </span>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => {
        const statusColors: Record<string, string> = {
          'active': '#10b981',
          'expired': '#6b7280',
          'terminated': '#ef4444',
          'pending': '#f59e0b'
        };
        const statusLabels: Record<string, string> = {
          'active': 'Activo',
          'expired': 'Expirado',
          'terminated': 'Terminado',
          'pending': 'Pendiente'
        };
        return (
          <span style={{
            color: statusColors[params.value] || '#6b7280',
            fontWeight: 600
          }}>
            {statusLabels[params.value] || params.value}
          </span>
        );
      }
    },
    {
      field: 'terms',
      headerName: 'Términos',
      width: 200,
      renderCell: (params) => (
        <div style={{
          whiteSpace: 'normal',
          lineHeight: '1.4',
          padding: '8px 0'
        }}>
          {params.value || '-'}
        </div>
      )
    }
  ];

  // Agregar columna de agencia solo para admin
  const columns = user?.role === 'admin'
    ? [...baseColumns, { field: 'agencyName', headerName: 'Agencia', width: 150 }]
    : baseColumns;

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'manager':
            endpoint = `/api/contracts?agencyId=${user.agencyId}`;
            break;
          case 'director':
            endpoint = `/api/contracts?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/contracts';
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
        setContracts(data.data || data);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

        // ============================================
        //SECCIÓN: DATOS DEMO
        //============================================
        /*
     const mockContracts: Contract[] = [
       {
         id: 1,
         artistName: 'Lee Min-ho',
         groupName: 'Phoenix',
         contractType: 'exclusive',
         startDate: '2023-01-15',
         endDate: '2028-01-14',
         value: 500000,
         status: 'active',
         agencyName: 'K-Pop Stars Agency',
         terms: 'Contrato exclusivo de 5 años con opción de renovación'
       },
       {
         id: 2,
         artistName: 'Kim Ji-soo',
         groupName: 'Starlight',
         contractType: 'exclusive',
         startDate: '2022-06-01',
         endDate: '2027-05-31',
         value: 450000,
         status: 'active',
         agencyName: 'K-Pop Stars Agency',
         terms: 'Contrato exclusivo con cláusulas de distribución internacional'
       },
       {
         id: 3,
         artistName: 'Park Soo-young',
         groupName: 'Dreamers',
         contractType: 'production',
         startDate: '2024-03-01',
         endDate: '2026-02-28',
         value: 200000,
         status: 'active',
         agencyName: 'K-Pop Stars Agency',
         terms: 'Contrato de producción para 2 álbumes'
       },
       {
         id: 4,
         artistName: 'Choi Min-jun',
         groupName: 'Thunder Squad',
         contractType: 'non_exclusive',
         startDate: '2023-09-01',
         endDate: '2025-08-31',
         value: 150000,
         status: 'pending',
         agencyName: 'Global Entertainment',
         terms: 'Contrato no exclusivo con derechos de distribución compartidos'
       },
       {
         id: 5,
         artistName: 'Jung Ha-neul',
         groupName: undefined,
         contractType: 'distribution',
         startDate: '2021-02-01',
         endDate: '2024-01-31',
         value: 100000,
         status: 'expired',
         agencyName: 'Global Entertainment',
         terms: 'Contrato de distribución para mercados asiáticos'
       }
     ];

     // Filtrar según rol para la demo
     let filteredContracts = mockContracts;
     if (user.role === 'manager' || user.role === 'director') {
       // Filtrar por agencia (en demo mostramos los de K-Pop Stars Agency)
       filteredContracts = mockContracts.filter(contract => contract.agencyName === 'K-Pop Stars Agency');
     }

     setContracts(filteredContracts);
     */
        //============================================
        //FIN SECCIÓN: DATOS DEMO
        //============================================ 

      } catch (error) {
        console.error('Error al cargar contratos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/contracts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar contrato');
      }

      setContracts(prev => prev.filter(contract => contract.id !== id));
    } catch (error) {
      console.error('Error al eliminar contrato:', error);
    }
  };

  const handleEditSave = async (updatedRow: Contract) => {
    try {
      const response = await fetch(`http://localhost:3000/api/contracts/${updatedRow.id}`, {
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
    } catch (error) {
      console.error('Error al actualizar contrato:', error);
    }
  };

  const handleCreateSave = async (newRow: Omit<Contract, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3000/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRow)
      });

      if (!response.ok) {
        throw new Error('Error al crear contrato');
      }

      const data = await response.json();
      setContracts(prev => [...prev, (data.data || data)]);
    } catch (error) {
      console.error('Error al crear contrato:', error);
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
        <DataTable
          columns={columns}
          rows={contracts}
          pagesize={10}
          onDelete={handleDelete}
          onEditSave={handleEditSave}
          onCreateSave={handleCreateSave}
          showEditButton={true}
        />
      )}
    </PageLayout>
  );
};

export default Contracts;
