import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../contextsLocal/AuthContext';

interface Artist {
  id: number;
  name: string;
  stageName: string;
  email: string;
  phone: string;
  birthDate: string;
  nationality: string;
  genre: string;
  status: string;
  agencyName?: string;
  groupName?: string;
}

const Artist: React.FC = () => {
  const { user } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Columnas del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre Real', width: 150 },
    { field: 'stageName', headerName: 'Nombre Artístico', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Teléfono', width: 130 },
    { 
      field: 'birthDate', 
      headerName: 'Fecha Nacimiento', 
      width: 130,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
    { field: 'nationality', headerName: 'Nacionalidad', width: 120 },
    { field: 'genre', headerName: 'Género', width: 120 },
    { 
      field: 'status', 
      headerName: 'Estado', 
      width: 120,
      renderCell: (params) => {
        const statusColors: Record<string, string> = {
          'active': '#10b981',
          'inactive': '#6b7280',
          'on_tour': '#8b5cf6',
          'training': '#3b82f6'
        };
        return (
          <span style={{ 
            color: statusColors[params.value] || '#6b7280',
            fontWeight: 600 
          }}>
            {params.value === 'active' ? 'Activo' :
             params.value === 'inactive' ? 'Inactivo' :
             params.value === 'on_tour' ? 'En Gira' :
             params.value === 'training' ? 'En Formación' : params.value}
          </span>
        );
      }
    }
  ];

  // Agregar columnas adicionales para admin
  const columns: GridColDef[] = user?.role === 'admin' 
    ? [
        ...baseColumns,
        { field: 'agencyName', headerName: 'Agencia', width: 150 },
        { field: 'groupName', headerName: 'Grupo', width: 130 }
      ]
    : baseColumns;

  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        // Descomentar cuando el backend esté listo
        /*
        let endpoint = '';
        
        switch (user.role) {
          case 'manager':
            endpoint = `/api/artists?agencyId=${user.agencyId}`;
            break;
          case 'director':
            endpoint = `/api/artists?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/artists';
            break;
          default:
            console.error('Rol no autorizado:', user.role);
            return;
        }

        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener artistas');
        }

        const data = await response.json();
        setArtists(data);
        */

        // DATOS DE PRUEBA
        const mockArtists: Artist[] = [
          {
            id: 1,
            name: 'Lee Min-ho',
            stageName: 'Phoenix',
            email: 'phoenix@kpopstars.com',
            phone: '+82-10-1234-5678',
            birthDate: '1998-03-15',
            nationality: 'Corea del Sur',
            genre: 'K-Pop',
            status: 'active',
            agencyName: 'K-Pop Stars Agency',
            groupName: 'Phoenix'
          },
          {
            id: 2,
            name: 'Kim Ji-soo',
            stageName: 'Starlight',
            email: 'starlight@kpopstars.com',
            phone: '+82-10-2345-6789',
            birthDate: '2000-07-22',
            nationality: 'Corea del Sur',
            genre: 'K-Pop',
            status: 'on_tour',
            agencyName: 'K-Pop Stars Agency',
            groupName: 'Starlight'
          },
          {
            id: 3,
            name: 'Park Soo-young',
            stageName: 'Luna',
            email: 'luna@dreamers.com',
            phone: '+82-10-3456-7890',
            birthDate: '1999-11-08',
            nationality: 'Corea del Sur',
            genre: 'Pop',
            status: 'active',
            agencyName: 'K-Pop Stars Agency',
            groupName: 'Dreamers'
          },
          {
            id: 4,
            name: 'Choi Min-jun',
            stageName: 'Thunder',
            email: 'thunder@kpopstars.com',
            phone: '+82-10-4567-8901',
            birthDate: '1997-05-30',
            nationality: 'Corea del Sur',
            genre: 'Hip-Hop',
            status: 'training',
            agencyName: 'K-Pop Stars Agency',
            groupName: undefined
          },
          {
            id: 5,
            name: 'Jung Ha-neul',
            stageName: 'Sky',
            email: 'sky@global.com',
            phone: '+82-10-5678-9012',
            birthDate: '2001-02-14',
            nationality: 'Corea del Sur',
            genre: 'R&B',
            status: 'inactive',
            agencyName: 'Global Entertainment',
            groupName: undefined
          }
        ];

        // Filtrar según rol
        let filteredArtists = mockArtists;
        if (user.role === 'manager' || user.role === 'director') {
          filteredArtists = mockArtists.filter(a => a.agencyName === 'K-Pop Stars Agency');
        }

        setArtists(filteredArtists);

      } catch (error) {
        console.error('Error al cargar artistas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, [user]);

  const handleDelete = async (id: number) => {
    console.log('Eliminar artista:', id);
    setArtists(prev => prev.filter(artist => artist.id !== id));
  };

  const handleEditSave = async (updatedRow: Artist) => {
    console.log('Actualizar artista:', updatedRow);
    setArtists(prev => 
      prev.map(artist => artist.id === updatedRow.id ? updatedRow : artist)
    );
  };

  if (!user || (user.role !== 'manager' && user.role !== 'director' && user.role !== 'admin')) {
    return (
      <PageLayout title="Artistas" description="No tienes permisos para ver esta página">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tienes acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Artistas" 
      description={
        user.role === 'admin' ? 'Vista global de todos los artistas del sistema' :
        user.role === 'director' ? 'Todos los artistas de tu agencia' :
        'Gestiona los artistas de tu agencia'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando artistas...
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={artists}
          pagesize={10}
          onDelete={handleDelete}
          onEditSave={handleEditSave}
          showEditButton={true}
        />
      )}
    </PageLayout>
  );
};

export default Artist;
