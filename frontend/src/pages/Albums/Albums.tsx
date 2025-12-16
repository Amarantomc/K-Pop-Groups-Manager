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
import { albumColumns } from '../../config/datatableSource';

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
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Título', width: 200 },
    { field: 'idGroup', headerName: 'ID Grupo', width: 100 },
    { field: 'producer', headerName: 'Productor', width: 180 },
    {
      field: 'releaseDate',
      headerName: 'Fecha de Lanzamiento',
      width: 160,
      valueFormatter: (params: { value?: string }) => {
        return params.value ? new Date(params.value).toLocaleDateString('es-ES') : '';
      }
    },
    { field: 'noSongs', headerName: 'Nº Canciones', width: 120 },
    { field: 'noCopiesSold', headerName: 'Copias Vendidas', width: 140 },
    {
      field: 'songs',
      headerName: 'IDs Canciones',
      width: 130,
      valueGetter: (params: any) => Array.isArray(params.row?.songs) ? params.row.songs.join(', ') : ''
    },
    {
      field: 'artists',
      headerName: 'Artistas',
      width: 130,
      valueGetter: (params: any) => Array.isArray(params.row?.artists) ? params.row.artists.map((a: any) => `Ap:${a.idAp}/Gr:${a.idGr}`).join(', ') : ''
    },
    {
      field: 'awards',
      headerName: 'Premios',
      width: 130,
      valueGetter: (params: any) => Array.isArray(params.row?.awards) ? params.row.awards.map((a: any) => `#${a.idPremio} (${a.año})`).join(', ') : ''
    },
    {
      field: 'groups',
      headerName: 'Grupos',
      width: 100,
      valueGetter: (params: any) => Array.isArray(params.row?.groups) ? params.row.groups.join(', ') : ''
    },
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
        console.log(data)
        const formattedData = data.data.map((album: any, index: number) => ({
          id: album.id ?? index,
          idGroup: album.idGroup,
          noCopiesSold: album.noCopiesSold,
          songs: album.songs,
          producer: album.producer,
          releaseDate: album.releaseDate,
          title: album.title,
          artists: album.artists,
          groups: album.groups,
          awards: album.awards
        }));
        console.log(formattedData);
        setAlbums(formattedData);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

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
          } catch (e) { }
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

  const handleExportPdf = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/export/albums', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al exportar PDF');
      }


      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);


      const a = document.createElement('a');
      a.href = url;
      a.download = 'albums.pdf';
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al exportar PDF'
      );
      setOpenError(true);
    }
  };
  if (!user) {
    return <div>Cargando...</div>;
  }

  if (user.role !== 'artist' && user.role !== 'manager' && user.role !== 'director' && user.role !== 'admin') {
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
              user.role !== 'artist' ? 'Mis álbumes' :
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
            columns={albumColumns}
            rows={albums}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            onExport={handleExportPdf}
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
            type="confirm"
          />
          <ConfirmDialog
            title="¡Éxito!"
            message="El álbum ha sido creado correctamente"
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
