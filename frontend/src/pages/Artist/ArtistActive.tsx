/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../contexts/auth/AuthContext';
import { artistConstraints } from '../../config/modalConstraints';

const ArtistActive: React.FC = () => {
  const { user } = useAuth();
  const [artistsRows, setArtistsRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Columnas del DataTable específicas para artistas activos
  const columns: GridColDef[] = [
    { 
      field: 'stageName', 
      headerName: 'Nombre Artístico', 
      width: 200,
      flex: 1 
    },
    { 
      field: 'groupName', 
      headerName: 'Grupo', 
      width: 180,
      flex: 1,
      valueGetter: (params) => params || 'Sin grupo'
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => {
        const statusColors: Record<string, string> = {
          'active': '#10b981',
          'inactive': '#6b7280',
          'on_tour': '#8b5cf6',
          'training': '#3b82f6'
        };
        const statusLabels: Record<string, string> = {
          'active': 'Activo',
          'inactive': 'Inactivo',
          'on_tour': 'En Gira',
          'training': 'En Formación'
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
    }
  ];

  useEffect(() => {
    const fetchActiveArtists = async () => {
      setIsLoading(true);
      try {
        if (!user) {
          console.error('Usuario no autenticado');
          return;
        }

        // Verificar que el usuario sea manager y tenga agencyId
        if (user.role !== 'manager' || !user.agencyId) {
          console.error('Usuario no autorizado o sin agencia asignada');
          return;
        }

        // Endpoint para obtener artistas activos por agencia
        const endpoint = `/api/artist/${user.agencyId}`;

        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener artistas activos');
        }

        const data = await response.json();
        console.log('Artistas activos recibidos:', data);

        // Formatear datos para el DataTable
        // Filtramos solo los artistas con estado 'Activo'
        const formattedData = data.data
          .filter((artist: any) => artist.Status === 'Activo')
          .map((artist: any, index: number) => ({
            id: artist.id ?? index,
            stageName: artist.ArtistName || 'Sin nombre',
            groupName: Array.isArray(artist.Groups) && artist.Groups.length > 0 
              ? artist.Groups[0].GroupName || artist.Groups[0].name || 'Sin grupo'
              : 'Sin grupo',
            status: artist.Status
          }));

        console.log('Datos formateados:', formattedData);
        setArtistsRows(formattedData);

      } catch (error) {
        console.error('Error al cargar artistas activos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveArtists();
  }, [user]);

  // Verificar permisos
  if (!user || user.role !== 'manager') {
    return (
      <PageLayout 
        title="Artistas Activos" 
        description="No tienes permisos para ver esta página"
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Solo los managers tienen acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Artistas Activos"
      description="Listado de artistas activos asociados a tu agencia"
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando artistas activos...
        </div>
      ) : artistsRows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No hay artistas activos en tu agencia.</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={artistsRows}
          pagesize={10}
          showEditButton={false}
          userRole={user?.role}
          //constraints={artistConstraints}
          //createEntity="artist"
        />
      )}
    </PageLayout>
  );
};

export default ArtistActive;
