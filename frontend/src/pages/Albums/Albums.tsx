import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import { useAuth } from '../../contexts/auth/AuthContext';
import { albumFields } from '../../config/formSource';
import { albumConstraints } from '../../config/modalConstraints';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';

interface Album {
  id: number;
  title: string;
  artistName: string;
  groupName?: string;
  releaseDate: string;
  genre: string;
  totalTracks: number;
  status: 'released' | 'upcoming' | 'recording' | 'cancelled';
  agencyName?: string;
}

const Albums: React.FC = () => {
  const { user } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const askDelete = (id: number) => {
    setAlbumToDelete(id);
    setOpenConfirm(true);
  };

  // Columnas base del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'title', headerName: 'Título', width: 200 },
    { field: 'artistName', headerName: 'Artista', width: 180 },
    { field: 'groupName', headerName: 'Grupo', width: 150 },
    {
      field: 'releaseDate',
      headerName: 'Fecha de Lanzamiento',
      width: 160,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
    { field: 'genre', headerName: 'Género', width: 130 },
    { field: 'totalTracks', headerName: 'Canciones', width: 100 },
    {
      field: 'status',
      headerName: 'Estado',
      width: 130,
      renderCell: (params) => {
        const statusColors: Record<string, string> = {
          'released': '#10b981',
          'upcoming': '#3b82f6',
          'recording': '#f59e0b',
          'cancelled': '#ef4444'
        };
        const statusLabels: Record<string, string> = {
          'released': 'Lanzado',
          'upcoming': 'Próximo',
          'recording': 'Grabando',
          'cancelled': 'Cancelado'
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

  // Agregar columna de agencia solo para admin
  const columns = user?.role === 'admin'
    ? [...baseColumns, { field: 'agencyName', headerName: 'Agencia', width: 150 }]
    : baseColumns;

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'manager':
            endpoint = `/api/album?agencyId=${user.agencyId}`;
            break;
          case 'director':
            endpoint = `/api/album?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/album';
            break;
          default:
            console.error('Rol no autorizado:', user.role);
            return;
        }

        // ============================================
        // SECCIÓN: BACKEND ENDPOINT
        // ============================================
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener álbumes');
        }

        const data = await response.json();
        setAlbums(data.data || data);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

        // ============================================
        //SECCIÓN: DATOS DEMO
        //============================================
        /*
     const mockAlbums: Album[] = [
       {
         id: 1,
         title: 'Rising Phoenix',
         artistName: 'Lee Min-ho',
         groupName: 'Phoenix',
         releaseDate: '2025-10-15',
         genre: 'K-Pop',
         totalTracks: 12,
         status: 'released',
         agencyName: 'K-Pop Stars Agency'
       },
       {
         id: 2,
         title: 'Starlight Dreams',
         artistName: 'Kim Ji-soo',
         groupName: 'Starlight',
         releaseDate: '2025-11-20',
         genre: 'K-Pop',
         totalTracks: 10,
         status: 'released',
         agencyName: 'K-Pop Stars Agency'
       },
       {
         id: 3,
         title: 'Dreamscape',
         artistName: 'Park Soo-young',
         groupName: 'Dreamers',
         releaseDate: '2025-12-25',
         genre: 'Pop',
         totalTracks: 8,
         status: 'upcoming',
         agencyName: 'K-Pop Stars Agency'
       },
       {
         id: 4,
         title: 'Thunder Strikes',
         artistName: 'Choi Min-jun',
         groupName: 'Thunder Squad',
         releaseDate: '2025-09-10',
         genre: 'Hip-Hop',
         totalTracks: 15,
         status: 'released',
         agencyName: 'Global Entertainment'
       },
       {
         id: 5,
         title: 'New Beginnings',
         artistName: 'Lee Min-ho',
         groupName: 'Phoenix',
         releaseDate: '2026-02-14',
         genre: 'K-Pop',
         totalTracks: 14,
         status: 'recording',
         agencyName: 'K-Pop Stars Agency'
       }
     ];

     // Filtrar según rol para la demo
     let filteredAlbums = mockAlbums;
     if (user.role === 'manager' || user.role === 'director') {
       // Filtrar por agencia (en demo mostramos los de K-Pop Stars Agency)
       filteredAlbums = mockAlbums.filter(album => album.agencyName === 'K-Pop Stars Agency');
     }

     setAlbums(filteredAlbums);
     */
        //============================================
        //FIN SECCIÓN: DATOS DEMO
        //============================================ 

      } catch (error) {
        console.error('Error al cargar álbumes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [user]);

  const handleDelete = async () => {
    if (albumToDelete === null) return;
    try {
      const response = await fetch(`http://localhost:3000/api/album/${albumToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar álbum');
      }

      setAlbums(prev => prev.filter(album => album.id !== albumToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar álbum:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar álbum');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setAlbumToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: Album) => {
    try {
      const response = await fetch(`http://localhost:3000/api/album/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar álbum');
      }

      const data = await response.json();
      setAlbums(prev =>
        prev.map(album => album.id === updatedRow.id ? (data.data || data) : album)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar álbum:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar álbum');
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

        const url = `${API_BASE}/api/album`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear álbum';
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
          setAlbums(prev => [...prev, result.data]);
        }
        setOpenAccept(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error de red al crear álbum';
        setErrorMessage(errorMsg);
        setOpenError(true);
      }
    })();
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:3000/api/album', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear álbum');
      }

      const data = await response.json();
      setAlbums(prev => [...prev, (data.data || data)]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear álbum:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear álbum';
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
      <PageLayout title="Álbumes" description="No tienes permisos para ver esta página">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tienes acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Gestión de Álbumes"
      description={
        user.role === 'manager' ? 'Administra todos los álbumes de los artistas de tu agencia' :
          user.role === 'director' ? 'Supervisa todos los álbumes de la agencia' :
            user.role === 'admin' ? 'Vista global de todos los álbumes del sistema' :
              'Gestión de álbumes'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando álbumes...
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={albums}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            showEditButton={true}
            constraints={albumConstraints}
            createEntity="album"
            userRole={user?.role}
            // onCreateClick={() => setShowCreateModal(true)}
          />
          <ConfirmDialog 
            message="¿Está seguro que desea eliminar este álbum?" 
            open={openConfirm} 
            onCancel={() => setOpenConfirm(false)} 
            onConfirm={handleDelete}
          />
          <ConfirmDialog 
            title="¡Éxito!"
            message="El álbum ha sido creado correctamente" 
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
          <ModalCreate
            isOpen={showCreateModal}
            title="Crear Álbum"
            createFields={albumFields}
            onSave={handleFormSubmit}
            onClose={() => setShowCreateModal(false)}
          />
          <Modal
            isOpen={showSuccessModal}
            title="Álbum creado exitosamente"
            onSave={() => setShowSuccessModal(false)}
            onClose={() => setShowSuccessModal(false)}
          />
        </>
      )}
    </PageLayout>
  );
};

export default Albums;
