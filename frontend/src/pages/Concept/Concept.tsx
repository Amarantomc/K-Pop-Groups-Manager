/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import { useAuth } from '../../contexts/auth/AuthContext';
import { conceptFields } from '../../config/formSource';
import { conceptConstraints } from '../../config/modalConstraints';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';

const Concept: React.FC = () => {
  const { user } = useAuth();
  const [conceptRows, setConceptRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [conceptToDelete, setConceptToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const askDelete = (id: number) => {
    setConceptToDelete(id);
    setOpenConfirm(true);
  };

  // Columnas del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', width: 200 },
    { field: 'description', headerName: 'Descripción', width: 300 },
  ];

  // Agregar columnas adicionales para admin
  /*const columns: GridColDef[] = user?.role === 'admin'
    ? [
      ...baseColumns,
      { field: 'agencyName', headerName: 'Agencia', width: 150 }
    ]
    : baseColumns;*/

  useEffect(() => {
    const fetchConcepts = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'manager':
          case 'director':
            endpoint = `/api/concept?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/concept';
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
          throw new Error('Error al obtener conceptos');
        }

        const data = await response.json();
        console.log(data);
        const formattedData = data.data.map((concept: any, index: number) => ({
          id: concept.id ?? index,
          name: concept.name,
          description: concept.description,
          category: concept.category,
          status: concept.status,
          createdAt: concept.createdAt,
          agencyName: concept.agencyName
        }));
        console.log(formattedData);
        setConceptRows(formattedData);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

      } catch (error) {
        console.error('Error al cargar conceptos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcepts();
  }, [user]);

  const handleDelete = async () => {
    if (conceptToDelete === null) return;
    try {
      const response = await fetch(`http://localhost:3000/api/concept/${conceptToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar concepto');
      }

      setConceptRows(prev => prev.filter(concept => concept.id !== conceptToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar concepto:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar concepto');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setConceptToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: any) => {
    try {
      const response = await fetch(`http://localhost:3000/api/concept/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar concepto');
      }

      const data = await response.json();
      setConceptRows(prev =>
        prev.map(concept => concept.id === updatedRow.id ? (data.data || data) : concept)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar concepto:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar concepto');
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

        const url = `${API_BASE}/api/concept`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear concepto';
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
          setConceptRows(prev => [...prev, result.data]);
        }
        setOpenAccept(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error de red al crear concepto';
        setErrorMessage(errorMsg);
        setOpenError(true);
      }
    })();
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/concept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Error al crear concepto');
      }

      const data = await response.json();
      setConceptRows(prev => [...prev, (data.data || data)]);
      
      setShowCreateModal(false);
      setOpenAccept(true);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error al crear el concepto';
      setErrorMessage(errorMsg);
      setShowCreateModal(false);
      setOpenError(true);
    }
  };

  if (!user || (user.role !== 'manager' && user.role !== 'director' && user.role !== 'admin')) {
    return (
      <PageLayout title="Conceptos" description="No tienes permisos para ver esta página">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tienes acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Conceptos"
      description={
        user.role === 'admin' ? 'Vista global de todos los conceptos del sistema' :
          user.role === 'director' ? 'Todos los conceptos de tu agencia' :
            'Gestiona los conceptos de tu agencia'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando conceptos...
        </div>
      ) : (
        <>
          <DataTable
            columns={baseColumns}
            rows={conceptRows}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            showEditButton={true}
            constraints={conceptConstraints}
            createEntity="concept"
            userRole={user?.role}
            // onCreateClick={() => setShowCreateModal(true)}
          />
        </>
      )}

      <ConfirmDialog 
        message="¿Está seguro que desea eliminar este concepto?" 
        open={openConfirm} 
        onCancel={() => setOpenConfirm(false)} 
        onConfirm={handleDelete}
      />
      <ConfirmDialog 
        title="¡Éxito!"
        message="El concepto ha sido creado correctamente" 
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
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Concepto"
        createFields={conceptFields}
        onSave={handleFormSubmit}
      />

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="✅ Concepto Creado Exitosamente"
        onSave={() => setShowSuccessModal(false)}
      />
    </PageLayout>
  );
};

export default Concept;
