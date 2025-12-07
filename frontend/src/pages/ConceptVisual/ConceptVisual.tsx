/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import { useAuth } from '../../contexts/auth/AuthContext';
import { visualConceptFields } from '../../config/formSource';
import { visualConceptConstraints } from '../../config/modalConstraints';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';

const ConceptVisual: React.FC = () => {
  const { user } = useAuth();
  const [conceptVisualRows, setConceptVisualRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [conceptVisualToDelete, setConceptVisualToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const askDelete = (id: number) => {
    setConceptVisualToDelete(id);
    setOpenConfirm(true);
  };

  // Columnas del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'title', headerName: 'Título', width: 200 },
    { field: 'conceptName', headerName: 'Concepto', width: 150 },
    { field: 'theme', headerName: 'Tema', width: 150 },
    { field: 'colorPalette', headerName: 'Paleta de Colores', width: 180 },
    { field: 'mood', headerName: 'Estado de Ánimo', width: 150 },
    {
      field: 'createdAt',
      headerName: 'Fecha de Creación',
      width: 150,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 120,
      renderCell: (params) => {
        const statusColors: Record<string, string> = {
          'draft': '#f59e0b',
          'approved': '#10b981',
          'in_review': '#3b82f6',
          'rejected': '#ef4444'
        };
        return (
          <span style={{
            color: statusColors[params.value] || '#6b7280',
            fontWeight: 600
          }}>
            {params.value === 'draft' ? 'Borrador' :
              params.value === 'approved' ? 'Aprobado' :
                params.value === 'in_review' ? 'En Revisión' :
                  params.value === 'rejected' ? 'Rechazado' : params.value}
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
    const fetchConceptVisuals = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'manager':
          case 'director':
            endpoint = `/api/concept-visual?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/concept-visual';
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
          throw new Error('Error al obtener conceptos visuales');
        }

        const data = await response.json();
        console.log(data);
        const formattedData = data.data.map((conceptVisual: any, index: number) => ({
          id: conceptVisual.id ?? index,
          title: conceptVisual.title,
          conceptName: conceptVisual.conceptName,
          theme: conceptVisual.theme,
          colorPalette: conceptVisual.colorPalette,
          mood: conceptVisual.mood,
          status: conceptVisual.status,
          createdAt: conceptVisual.createdAt,
          agencyName: conceptVisual.agencyName
        }));
        console.log(formattedData);
        setConceptVisualRows(formattedData);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

      } catch (error) {
        console.error('Error al cargar conceptos visuales:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConceptVisuals();
  }, [user]);

  const handleDelete = async () => {
    if (conceptVisualToDelete === null) return;
    try {
      const response = await fetch(`http://localhost:3000/api/visual-concept/${conceptVisualToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar concepto visual');
      }

      setConceptVisualRows(prev => prev.filter(conceptVisual => conceptVisual.id !== conceptVisualToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar concepto visual:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar concepto visual');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setConceptVisualToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: any) => {
    try {
      // PUT /api/visual-concept/:id - Sin autenticación
      const response = await fetch(`http://localhost:3000/api/visual-concept/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar concepto visual');
      }

      const data = await response.json();
      setConceptVisualRows(prev =>
        prev.map(conceptVisual => conceptVisual.id === updatedRow.id ? (data.data || data) : conceptVisual)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar concepto visual:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar concepto visual');
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

        const url = `${API_BASE}/api/concept-visual`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear concepto visual';
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
          setConceptVisualRows(prev => [...prev, result.data]);
        }
        setOpenAccept(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error de red al crear concepto visual';
        setErrorMessage(errorMsg);
        setOpenError(true);
      }
    })();
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      // POST /api/visual-concept - Sin autenticación
      const response = await fetch('http://localhost:3000/api/visual-concept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear concepto visual');
      }

      const data = await response.json();
      setConceptVisualRows(prev => [...prev, (data.data || data)]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear concepto visual:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear concepto visual';
      setErrorMessage(errorMsg);
      setShowCreateModal(false);
      setOpenError(true);
    }
  };

  if (!user || (user.role !== 'manager' && user.role !== 'director' && user.role !== 'admin')) {
    return (
      <PageLayout title="Conceptos Visuales" description="No tienes permisos para ver esta página">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tienes acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Conceptos Visuales"
      description={
        user.role === 'admin' ? 'Vista global de todos los conceptos visuales del sistema' :
          user.role === 'director' ? 'Todos los conceptos visuales de tu agencia' :
            'Gestiona los conceptos visuales de tu agencia'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando conceptos visuales...
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={conceptVisualRows}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            showEditButton={true}
            constraints={visualConceptConstraints}
            createEntity="visualConcept"
            userRole={user?.role}
            // onCreateClick={() => setShowCreateModal(true)}
          />
          <ConfirmDialog 
            message="¿Está seguro que desea eliminar este concepto visual?" 
            open={openConfirm} 
            onCancel={() => setOpenConfirm(false)} 
            onConfirm={handleDelete}
          />
          <ConfirmDialog 
            title="¡Éxito!"
            message="El concepto visual ha sido creado correctamente" 
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
            title="Crear Concepto Visual"
            createFields={visualConceptFields}
            onSave={handleFormSubmit}
            onClose={() => setShowCreateModal(false)}
          />
          <Modal
            isOpen={showSuccessModal}
            title="Concepto Visual creado exitosamente"
            onSave={() => setShowSuccessModal(false)}
            onClose={() => setShowSuccessModal(false)}
          />
        </>
      )}
    </PageLayout>
  );
};

export default ConceptVisual;
