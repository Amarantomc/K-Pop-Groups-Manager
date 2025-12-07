import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import { useAuth } from '../../contexts/auth/AuthContext';
import { groupFields } from '../../config/formSource';
import { groupConstraints } from '../../config/modalConstraints';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';

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
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const askDelete = (id: number) => {
    setGroupToDelete(id);
    setOpenConfirm(true);
  };

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
        // GET /api/group - No requiere autenticación según documentación
        const response = await fetch(`http://localhost:3000${endpoint}`);

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

  const handleDelete = async () => {
    if (groupToDelete === null) return;
    try {
      const response = await fetch(`http://localhost:3000/api/group/delete/${groupToDelete}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error al eliminar grupo');
      }

      setGroups(prev => prev.filter(group => group.id !== groupToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar grupo');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setGroupToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: Group) => {
    try {
      // PUT /api/group/update/:id - Sin autenticación
      const response = await fetch(`http://localhost:3000/api/group/update/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
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
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar grupo:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar grupo');
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
        // POST /api/group - Sin autenticación
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };

        const url = `${API_BASE}/api/group`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear grupo';
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
          setGroups(prev => [...prev, result.data]);
        }
        setOpenAccept(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error de red al crear grupo';
        setErrorMessage(errorMsg);
        setOpenError(true);
      }
    })();
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:3000/api/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear grupo');
      }

      const data = await response.json();
      setGroups(prev => [...prev, (data.data || data)]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear grupo:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear grupo';
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
        <>
          <DataTable
            columns={columns}
            rows={groups}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            showEditButton={true}
            constraints={groupConstraints}
            createEntity="group"
            userRole={user?.role}
            // onCreateClick={() => setShowCreateModal(true)}
          />
          <ConfirmDialog 
            message="¿Está seguro que desea eliminar este grupo?" 
            open={openConfirm} 
            onCancel={() => setOpenConfirm(false)} 
            onConfirm={handleDelete}
          />
          <ConfirmDialog 
            title="¡Éxito!"
            message="El grupo ha sido creado correctamente" 
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
            title="Crear Grupo"
            createFields={groupFields}
            onSave={handleFormSubmit}
            onClose={() => setShowCreateModal(false)}
          />
          <Modal
            isOpen={showSuccessModal}
            title="Grupo creado exitosamente"
            onSave={() => setShowSuccessModal(false)}
            onClose={() => setShowSuccessModal(false)}
          />
        </>
      )}
    </PageLayout>
  );
};

export default Groups;
