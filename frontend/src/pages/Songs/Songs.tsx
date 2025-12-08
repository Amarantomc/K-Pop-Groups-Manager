/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import { useAuth } from '../../contexts/auth/AuthContext';
import { songFields } from '../../config/formSource';
import { songConstraints } from '../../config/modalConstraints';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import { songColumns } from '../../config/datatableSource';

const Songs: React.FC = () => {
  const { user } = useAuth();
  const [songRows, setSongRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const askDelete = (id: number) => {
    setSongToDelete(id);
    setOpenConfirm(true);
  };

  // Columnas del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'title', headerName: 'Título', width: 200 },
    { field: 'albumTitle', headerName: 'Álbum', width: 180 },
    { field: 'artistName', headerName: 'Artista', width: 150 },
    { field: 'groupName', headerName: 'Grupo', width: 150 },
    { 
      field: 'duration', 
      headerName: 'Duración', 
      width: 120,
      renderCell: (params) => {
        const seconds = params.value as number;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      }
    },
    { field: 'genre', headerName: 'Género', width: 130 },
    {
      field: 'releaseDate',
      headerName: 'Fecha de Lanzamiento',
      width: 150,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
  ];

  // Agregar columna de agencia según el rol
  const columns: GridColDef[] = 
    user?.role === 'admin' 
      ? [...baseColumns, { field: 'agencyName', headerName: 'Agencia', width: 150 }]
      : baseColumns;

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // ============================================
        // SECCIÓN: BACKEND ENDPOINT
        // ============================================
        const response = await fetch('http://localhost:3000/api/song', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar canciones');
        }

        const data = await response.json();
        console.log(data);
        const formattedData = data.data.map((song: any, index: number) => ({
          id: song.id ?? index,
          title: song.title,
          producer : song.producer,
          genre: song.gender,
          releaseDate: song.releaseDate,
          albums : song.albums
        }));
        console.log(formattedData);
        setSongRows(formattedData);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

      } catch (error) {
        console.error('Error al cargar canciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [user]);

  const handleDelete = async () => {
    if (songToDelete === null) return;
    try {
      const response = await fetch(`http://localhost:3000/api/songs/${songToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar canción');
      }

      setSongRows(prev => prev.filter(song => song.id !== songToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar canción:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar canción');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setSongToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: any) => {
    try {
      const response = await fetch(`http://localhost:3000/api/songs/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar canción');
      }

      const data = await response.json();
      setSongRows(prev =>
        prev.map(song => song.id === updatedRow.id ? (data.data || data) : song)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar canción:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar canción');
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

        const url = `${API_BASE}/api/songs`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear canción';
          try {
            const txt = await res.text();
            try { const j = JSON.parse(txt); msg = j?.message || j?.error || txt || msg; }
            catch { msg = txt || msg; }
          } catch (e) {}
          setErrorMessage(msg);
          setOpenError(true);
          return;
        }

        const result = await res.json().catch(() => null);
        if (result?.data) {
          setSongRows(prev => [...prev, result.data]);
        }
        setOpenAccept(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error de red al crear canción';
        setErrorMessage(errorMsg);
        setOpenError(true);
      }
    })();
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:3000/api/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al crear canción');
      }

      const data = await response.json();
      setSongRows(prev => [...prev, (data.data || data)]);
      
      setShowCreateModal(false);
      setOpenAccept(true);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al crear la canción';
      setErrorMessage(errorMsg);
      setShowCreateModal(false);
      setOpenError(true);
    }
  };

  if (!user || (user.role !== 'manager' && user.role !== 'director' && user.role !== 'admin')) {
    return (
      <PageLayout title="Canciones" description="No tienes permisos para ver esta página">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tienes acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Canciones"
      description={
        user.role === 'admin' ? 'Vista global de todas las canciones del sistema' :
          user.role === 'director' ? 'Todas las canciones de tu agencia' :
            'Gestiona las canciones de tu agencia'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando canciones...
        </div>
      ) : (
        <>
          <DataTable
            columns={songColumns}
            rows={songRows}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            showEditButton={true}
            constraints={songConstraints}
            createEntity="song"
            userRole={user?.role}
            // onCreateClick={() => setShowCreateModal(true)}
          />
        </>
      )}

      <ConfirmDialog 
        message="¿Está seguro que desea eliminar esta canción?" 
        open={openConfirm} 
        onCancel={() => setOpenConfirm(false)} 
        onConfirm={handleDelete}
      />
      <ConfirmDialog 
        title="¡Éxito!"
        message="La canción ha sido creada correctamente" 
        open={openAccept} 
        onCancel={() => setOpenAccept(false)} 
        onConfirm={() => setOpenAccept(false)} 
        confirmText="Aceptar" 
        showDeleteButton={false}
      />
      <ConfirmDialog 
        title="Error"
        message={errorMessage} 
        open={openError} 
        onCancel={() => setOpenError(false)} 
        onConfirm={() => setOpenError(false)} 
        confirmText="Aceptar" 
        showDeleteButton={false}
      />

      {/* Modal para crear canción */}
      <ModalCreate
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nueva Canción"
        createFields={songFields}
        onSave={handleFormSubmit}
      />

      {/* Modal de confirmación de éxito */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="✅ Canción Creada Exitosamente"
        onSave={() => setShowSuccessModal(false)}
      />
    </PageLayout>
  );
};

export default Songs;
