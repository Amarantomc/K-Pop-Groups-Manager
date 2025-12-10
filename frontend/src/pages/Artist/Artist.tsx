/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import { useAuth } from '../../contexts/auth/AuthContext';
import { artistColumns } from '../../config/datatableSource';
import { artistConstraints } from '../../config/modalConstraints';
import type { Artista } from '../../types/types';



const Artist: React.FC = () => {
  const { user } = useAuth();
  const [artistsRows, setArtistsRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apprenticeToDelete, setApprenticeToDelete] = useState<number | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const askDelete = (id : number) => {
    setApprenticeToDelete(id);
    setOpenConfirm(true);
  }
  // Columnas del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre Real', width: 150 },
    { field: 'stageName', headerName: 'Nombre Artístico', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Teléfono', width: 130 },
    {
      field: 'dateOfBirth',
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

        let endpoint = '';
        switch (user.role) {
          case 'manager':
          case 'director':
            endpoint = `/api/artist?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/artist';
            break;
          default:
            console.error('Rol no autorizado:', user.role);
            return;
        }

        // Obtener artistas
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Error al obtener artistas');
        }
        const data = await response.json();

        // Obtener aprendices
        const apprenticeRes = await fetch('http://localhost:3000/api/apprentice', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        if (!apprenticeRes.ok) {
          throw new Error('Error al obtener aprendices');
        }
        const apprenticeData = await apprenticeRes.json();
        // Diccionario id -> aprendiz completo
        const apprenticeMap: Record<string | number, { name: string, dateOfBirth: string }> = {};
        apprenticeData.data.forEach((appr: any) => {
          apprenticeMap[appr.id] = { name: appr.name, dateOfBirth: appr.dateOfBirth };
        });
        // Mapear artistas con nombre real y fecha de nacimiento
        const formattedData = data.data.map((artist: any, index: number) => ({
          id: artist.id ?? index,
          ArtistName: artist.ArtistName,
          DebutDate: artist.DebutDate,
          Status: artist.Status,
          ApprenticeId: artist.ApprenticeId,
          GroupId: artist.GroupId,
          realName: apprenticeMap[artist.ApprenticeId]?.name || '',
          dateOfBirth: apprenticeMap[artist.ApprenticeId]?.dateOfBirth || ''
        }));
        setArtistsRows(formattedData);
      } catch (error) {
        console.error('Error al cargar artistas:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtists();
  }, [user]);

  const handleDelete = async () => {
    if (apprenticeToDelete === null) return;
    try {
      // DELETE /api/artist/:apprenticeId&:groupId - Requiere rol Staff
      const response = await fetch(`http://localhost:3000/api/artist/${apprenticeToDelete}&${groupToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar artista');
      }

      setArtistsRows(prev => prev.filter(artist => artist.id !== apprenticeToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar artista:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar artista');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setApprenticeToDelete(null);
      setGroupToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: Artista) => {
    try {
      // PUT /api/artist/:apprenticeId&:groupId - Requiere rol Staff
      // Necesitamos los IDs compuestos del artista
      const apprenticeId = updatedRow.ApprenticeId || updatedRow.id;
      const groupId = updatedRow.GroupId || 0;
      
      const response = await fetch(`http://localhost:3000/api/artist/${apprenticeId}&${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar artista');
      }

      const data = await response.json();
      setArtistsRows(prev =>
        prev.map(artist => artist.id === updatedRow.id ? (data.data || data) : artist)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar artista:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar artista');
      setOpenError(true);
    }
  };

  const handleCreateSave = async (newRow: Omit<Artista, 'id'>) => {
    try {
      // POST /api/artist - Requiere rol Staff
      const response = await fetch('http://localhost:3000/api/artist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRow)
      });

      if (!response.ok) {
        throw new Error('Error al crear artista');
      }

      const data = await response.json();
      setArtistsRows(prev => [...prev, (data.data || data)]);
    } catch (error) {
      console.error('Error al crear artista:', error);
    }
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
        <>
          <DataTable
            columns={artistColumns}
            rows={artistsRows}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            showEditButton={true}
            showCreateButton={false}
            userRole={user?.role}
            //constraints={artistConstraints}
            //createEntity="artist"
          />
          <ConfirmDialog
            message="¿Está seguro de que desea eliminar este artista?"
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

export default Artist;
