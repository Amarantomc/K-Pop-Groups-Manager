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

  const askDelete = (id : number | string) => {
    const [apprenticeId, groupId] = String(id)
    .split(':')
    .map(Number);
    setApprenticeToDelete(apprenticeId);
    setGroupToDelete(groupId)
    setOpenConfirm(true);
  }
  // Columnas del DataTable


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
        const formattedData = data.data.map((artist: any) => ({
          id: `${artist.ApprenticeId}:${artist.GroupId}`,
          ArtistName: artist.ArtistName,
          DebutDate: artist.DebutDate,
          Status: artist.Status,
          ApprenticeId: artist.ApprenticeId,
          GroupId: artist.GroupId,
          realName: artist.realName,
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

      setArtistsRows(prev => prev.filter(artist => artist.id !== `${apprenticeToDelete}:${groupToDelete}`));
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
            message="¿Está seguro que desea eliminar este artista?" 
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
        </>
      )}
    </PageLayout>
  );
};

export default Artist;
