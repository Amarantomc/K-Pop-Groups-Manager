import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../contexts/auth/AuthContext';

interface Group {
  id: number;
  name: string;
  debutDate: string;
  genre: string;
  memberCount: number;
  agencyName: string;
  status: 'active' | 'inactive' | 'disbanded' | 'on_hiatus';
  description?: string;
}

const Groups: React.FC = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Columnas base del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre del Grupo', width: 200 },
    {
      field: 'debutDate',
      headerName: 'Fecha de Debut',
      width: 150,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
    { field: 'genre', headerName: 'Género', width: 130 },
    { field: 'memberCount', headerName: 'Miembros', width: 100 },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => {
        const statusColors: Record<string, string> = {
          'active': '#10b981',
          'inactive': '#6b7280',
          'disbanded': '#ef4444',
          'on_hiatus': '#f59e0b'
        };
        const statusLabels: Record<string, string> = {
          'active': 'Activo',
          'inactive': 'Inactivo',
          'disbanded': 'Disuelto',
          'on_hiatus': 'En Hiato'
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
      field: 'description',
      headerName: 'Descripción',
      width: 250,
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
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'manager':
          case 'director':
            endpoint = `/api/group?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/group';
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
          throw new Error('Error al obtener grupos');
        }

        const data = await response.json();
        setGroups(data.data || data);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

        // ============================================
        // SECCIÓN: DATOS DEMO
        // ============================================

        /*
     const mockGroups: Group[] = [
       {
         id: 1,
         name: 'Phoenix',
         debutDate: '2023-03-15',
         genre: 'K-Pop',
         memberCount: 5,
         agencyName: 'K-Pop Stars Agency',
         status: 'active',
         description: 'Grupo de K-Pop con enfoque en performances energéticos y coreografías complejas'
       },
       {
         id: 2,
         name: 'Starlight',
         debutDate: '2022-07-22',
         genre: 'K-Pop',
         memberCount: 4,
         agencyName: 'K-Pop Stars Agency',
         status: 'active',
         description: 'Girl group conocido por sus conceptos elegantes y vocales poderosos'
       },
       {
         id: 3,
         name: 'Dreamers',
         debutDate: '2021-11-08',
         genre: 'Pop',
         memberCount: 6,
         agencyName: 'K-Pop Stars Agency',
         status: 'active',
         description: 'Grupo versátil con estilo pop contemporáneo'
       },
       {
         id: 4,
         name: 'Thunder Squad',
         debutDate: '2020-05-30',
         genre: 'Hip-Hop',
         memberCount: 3,
         agencyName: 'Global Entertainment',
         status: 'on_hiatus',
         description: 'Crew de hip-hop con enfoque en rap y producción'
       },
       {
         id: 5,
         name: 'Crystal Hearts',
         debutDate: '2019-02-14',
         genre: 'R&B',
         memberCount: 4,
         agencyName: 'Global Entertainment',
         status: 'disbanded',
         description: 'Grupo de R&B disuelto en 2024'
       }
     ];

     // Filtrar según rol para la demo
     let filteredGroups = mockGroups;
     if (user.role === 'manager' || user.role === 'director') {
       // Filtrar por agencia (en demo mostramos los de K-Pop Stars Agency)
       filteredGroups = mockGroups.filter(group => group.agencyName === 'K-Pop Stars Agency');
     }

     setGroups(filteredGroups);
     */
      //============================================
      //FIN SECCIÓN: DATOS DEMO
      //============================================ 

      } catch (error) {
        console.error('Error al cargar grupos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar grupo');
      }

      setGroups(prev => prev.filter(group => group.id !== id));
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
    }
  };

  const handleEditSave = async (updatedRow: Group) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar grupo');
      }

      const data = await response.json();
      setGroups(prev =>
        prev.map(group => group.id === updatedRow.id ? (data.data || data) : group)
      );
    } catch (error) {
      console.error('Error al actualizar grupo:', error);
    }
  };

  const handleCreateSave = async (newRow: Omit<Group, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRow)
      });

      if (!response.ok) {
        throw new Error('Error al crear grupo');
      }

      const data = await response.json();
      setGroups(prev => [...prev, (data.data || data)]);
    } catch (error) {
      console.error('Error al crear grupo:', error);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  if (user.role !== 'manager' && user.role !== 'director' && user.role !== 'admin') {
    return (
      <PageLayout title="Grupos" description="No tienes permisos para ver esta página">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tienes acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gestión de Grupos"
      description={
        user.role === 'manager' ? 'Administra todos los grupos de tu agencia' :
          user.role === 'director' ? 'Supervisa todos los grupos de la agencia' :
            user.role === 'admin' ? 'Vista global de todos los grupos del sistema' :
              'Gestión de grupos'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando grupos...
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={groups}
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

export default Groups;
