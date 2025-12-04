import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../contexts/auth/AuthContext';

interface Income {
  id: number;
  artistName: string;
  groupName: string;
  amount: number;
  source: string;
  description: string;
  incomeDate: string;
  agencyName?: string;
}

const Income: React.FC = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Columnas base del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'artistName', headerName: 'Artista', width: 180 },
    { field: 'groupName', headerName: 'Grupo', width: 150 },
    {
      field: 'amount',
      headerName: 'Monto',
      width: 140,
      renderCell: (params) => {
        const amount = params.value as number;
        return (
          <span style={{
            color: '#10b981',
            fontWeight: 700,
            fontSize: '15px'
          }}>
            ${amount.toLocaleString('es-ES')}
          </span>
        );
      }
    },
    {
      field: 'source',
      headerName: 'Fuente',
      width: 150
    },
    {
      field: 'description',
      headerName: 'Descripción',
      width: 250,
      renderCell: (params) => (
        <div style={{
          whiteSpace: 'normal',
          lineHeight: '1.4',
          padding: '8px 0'
        }}>
          {params.value}
        </div>
      )
    },
    {
      field: 'incomeDate',
      headerName: 'Fecha',
      width: 130,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    }
  ];

  // Agregar columna de agencia solo para admin
  const columns = user?.role === 'admin'
    ? [...baseColumns, { field: 'agencyName', headerName: 'Agencia', width: 150 }]
    : baseColumns;

  useEffect(() => {
    const fetchIncomes = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'artist':
            // Ingresos del artista específico
            endpoint = `/api/incomes?artistId=${user.profileData?.artistId || user.id}`;
            break;

          case 'manager':
            // Todos los ingresos de todos los artistas de la agencia del manager
            endpoint = `/api/incomes?agencyId=${user.agencyId}`;
            break;

          case 'director':
            // Todos los ingresos de todos los artistas de la agencia del director
            endpoint = `/api/incomes?agencyId=${user.agencyId}`;
            break;

          case 'admin':
            // Implementar más adelante - todos los ingresos del sistema
            endpoint = '/api/incomes';
            break;

          default:
            console.error('Rol no reconocido:', user.role);
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
          throw new Error('Error al obtener ingresos');
        }

        const data = await response.json();
        setIncomes(data.data || data);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

        //============================================
        // SECCIÓN: DATOS DEMO
        //============================================
        /*
        const mockIncomes: Income[] = [
          {
            id: 1,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Lee Min-ho',
            groupName: 'Phoenix',
            amount: 15000,
            source: 'Concierto',
            description: 'Presentación en Seoul Music Festival',
            incomeDate: '2025-11-28T19:00:00',
            agencyName: 'K-Pop Stars Agency'
          },
          {
            id: 2,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Kim Ji-soo',
            groupName: 'Starlight',
            amount: 8500,
            source: 'Streaming',
            description: 'Regalías de plataformas digitales - Noviembre',
            incomeDate: '2025-11-25T10:00:00',
            agencyName: 'K-Pop Stars Agency'
          },
          {
            id: 3,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Lee Min-ho',
            groupName: 'Phoenix',
            amount: 12000,
            source: 'Publicidad',
            description: 'Campaña publicitaria Samsung Galaxy',
            incomeDate: '2025-11-20T14:30:00',
            agencyName: 'K-Pop Stars Agency'
          },
          {
            id: 4,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Park Soo-young',
            groupName: 'Dreamers',
            amount: 5000,
            source: 'Venta de Merchandise',
            description: 'Ventas de productos oficiales - Mes de Noviembre',
            incomeDate: '2025-11-18T09:00:00',
            agencyName: 'Global Entertainment'
          },
          {
            id: 5,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Kim Ji-soo',
            groupName: 'Starlight',
            amount: 20000,
            source: 'Concierto',
            description: 'Tour Internacional - Tokio',
            incomeDate: '2025-11-15T20:00:00',
            agencyName: 'K-Pop Stars Agency'
          }
        ];

        // Filtrar según rol para la demo
        let filteredIncomes = mockIncomes;
        if (user.role === 'artist') {
          // Solo ingresos del artista actual
          filteredIncomes = mockIncomes.filter(income => income.id <= 3);
        } else if (user.role === 'manager' || user.role === 'director') {
          // Filtrar por agencia (en demo mostramos los de K-Pop Stars Agency)
          filteredIncomes = mockIncomes.filter(income => income.agencyName === 'K-Pop Stars Agency');
        }

        setIncomes(filteredIncomes);
        */
        // ============================================
        // FIN SECCIÓN: DATOS DEMO
        // ============================================ */

      } catch (error) {
        console.error('Error al cargar ingresos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncomes();
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/incomes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar ingreso');
      }

      setIncomes(prev => prev.filter(income => income.id !== id));
    } catch (error) {
      console.error('Error al eliminar ingreso:', error);
    }
  };

  const handleEditSave = async (updatedRow: Income) => {
    try {
      const response = await fetch(`http://localhost:3000/api/incomes/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar ingreso');
      }

      const data = await response.json();
      setIncomes(prev =>
        prev.map(income => income.id === updatedRow.id ? (data.data || data) : income)
      );
    } catch (error) {
      console.error('Error al actualizar ingreso:', error);
    }
  };

  const handleCreateSave = async (newRow: Omit<Income, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3000/api/incomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRow)
      });

      if (!response.ok) {
        throw new Error('Error al crear ingreso');
      }

      const data = await response.json();
      setIncomes(prev => [...prev, (data.data || data)]);
    } catch (error) {
      console.error('Error al crear ingreso:', error);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <PageLayout
      title="Ingresos"
      description={
        user.role === 'artist' ? 'Consulta tus ingresos generados por conciertos, streaming, publicidad y ventas de merchandise' :
          user.role === 'manager' ? 'Gestiona todos los ingresos de los artistas de tu agencia' :
            user.role === 'director' ? 'Supervisa todos los ingresos generados por los artistas de la agencia' :
              user.role === 'admin' ? 'Vista global de todos los ingresos del sistema (próximamente)' :
                'Gestión de ingresos'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando ingresos...
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={incomes}
          pagesize={10}
          onDelete={handleDelete}
          onEditSave={handleEditSave}
          onCreateSave={handleCreateSave}
          showEditButton={user.role === 'manager' || user.role === 'director' || user.role === 'admin'}
        />
      )}
    </PageLayout>
  );
};

export default Income;
