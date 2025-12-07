/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import { useAuth } from '../../contexts/auth/AuthContext';
import { awardFields } from '../../config/formSource';
import { awardConstraints } from '../../config/modalConstraints';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';

const Award: React.FC = () => {
  const { user } = useAuth();
  const [awardRows, setAwardRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para el modal de creación
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [awardToDelete, setAwardToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const askDelete = (id: number) => {
    setAwardToDelete(id);
    setOpenConfirm(true);
  };

  // Columnas del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'awardName', headerName: 'Premio', width: 200 },
    { field: 'category', headerName: 'Categoría', width: 180 },
    { field: 'recipientName', headerName: 'Ganador', width: 180 },
    { field: 'recipientType', headerName: 'Tipo', width: 120 },
    {
      field: 'awardDate',
      headerName: 'Fecha de Premio',
      width: 150,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
    { field: 'event', headerName: 'Evento', width: 180 },
    {
      field: 'importance',
      headerName: 'Importancia',
      width: 120,
      renderCell: (params) => {
        const importanceColors: Record<string, string> = {
          'major': '#ef4444',
          'intermediate': '#f59e0b',
          'minor': '#3b82f6',
          'nomination': '#6b7280'
        };
        return (
          <span style={{
            color: importanceColors[params.value] || '#6b7280',
            fontWeight: 600
          }}>
            {params.value === 'major' ? 'Mayor' :
              params.value === 'intermediate' ? 'Intermedio' :
                params.value === 'minor' ? 'Menor' :
                  params.value === 'nomination' ? 'Nominación' : params.value}
          </span>
        );
      }
    }
  ];

  // Agregar columnas adicionales para admin
  const columns: GridColDef[] = user?.role === 'admin'
    ? [
      ...baseColumns,
      { field: 'agencyName', headerName: 'Agencia', width: 150 }
    ]
    : baseColumns;

  useEffect(() => {
    const fetchAwards = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'manager':
          case 'director':
            endpoint = `/api/award?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/award';
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
          throw new Error('Error al obtener premios');
        }

        const data = await response.json();
        console.log(data);
        const formattedData = data.data.map((award: any, index: number) => ({
          id: award.id ?? index,
          awardName: award.awardName,
          category: award.category,
          recipientName: award.recipientName,
          recipientType: award.recipientType,
          awardDate: award.awardDate,
          event: award.event,
          importance: award.importance,
          agencyName: award.agencyName
        }));
        console.log(formattedData);
        setAwardRows(formattedData);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

      } catch (error) {
        console.error('Error al cargar premios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAwards();
  }, [user]);

  const handleDelete = async () => {
    if (awardToDelete === null) return;
    try {
      const response = await fetch(`http://localhost:3000/api/award/${awardToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar premio');
      }

      setAwardRows(prev => prev.filter(award => award.id !== awardToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar premio:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar premio');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setAwardToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: any) => {
    try {
      const response = await fetch(`http://localhost:3000/api/award/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar premio');
      }

      const data = await response.json();
      setAwardRows(prev =>
        prev.map(award => award.id === updatedRow.id ? (data.data || data) : award)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar premio:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar premio');
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

        const url = `${API_BASE}/api/award`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear premio';
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
          setAwardRows(prev => [...prev, result.data]);
        }
        setOpenAccept(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error de red al crear premio';
        setErrorMessage(errorMsg);
        setOpenError(true);
      }
    })();
  };

  // Nueva función para manejar la creación desde el formulario
  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/award', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al crear premio');
      }

      const data = await response.json();
      setAwardRows(prev => [...prev, (data.data || data)]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear premio:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear premio';
      setErrorMessage(errorMsg);
      setShowCreateModal(false);
      setOpenError(true);
    }
  };

  if (!user || (user.role !== 'manager' && user.role !== 'director' && user.role !== 'admin')) {
    return (
      <PageLayout title="Premios" description="No tienes permisos para ver esta página">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tienes acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Premios"
      description={
        user.role === 'admin' ? 'Vista global de todos los premios del sistema' :
          user.role === 'director' ? 'Todos los premios de tu agencia' :
            'Gestiona los premios de tu agencia'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando premios...
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={awardRows}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            showEditButton={true}
            constraints={awardConstraints}
            createEntity="award"
            userRole={user?.role}
            // onCreateClick={() => setShowCreateModal(true)}
          />
        </>
      )}

      <ConfirmDialog 
        message="¿Está seguro que desea eliminar este premio?" 
        open={openConfirm} 
        onCancel={() => setOpenConfirm(false)} 
        onConfirm={handleDelete}
      />
      <ConfirmDialog 
        title="¡Éxito!"
        message="El premio ha sido creado correctamente" 
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

      {/* Modal para crear premio */}
      <ModalCreate
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Premio"
        createFields={awardFields}
        onSave={handleFormSubmit}
      />

      {/* Modal de confirmación de éxito */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="✅ Premio Creado Exitosamente"
        onSave={() => setShowSuccessModal(false)}
      />
    </PageLayout>
  );
};

export default Award;
