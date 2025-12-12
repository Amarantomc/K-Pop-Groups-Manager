/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import '../../components/carousel/carousel.css';
import Carousel from '../../components/carousel/Carousel';
import { visualConceptConstraints } from '../../config/modalConstraints';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import { useAuth } from '../../contexts/auth/AuthContext';
import { visualConceptFields } from '../../config/formSource';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';

const ConceptVisual: React.FC = () => {
  const { user } = useAuth();
  const [conceptVisualRows, setConceptVisualRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  // No se necesita estado de índice, Swiper lo maneja
  const [editRow, setEditRow] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
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

  const handleEditClick = (row: any) => {
    setEditRow(row);
    setShowEditModal(true);
  };

  const handleDeleteClick = (id: number) => {
    askDelete(id);
  };


  useEffect(() => {
    const fetchConceptVisuals = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        // Obtener conceptos visuales
        let endpoint = '';
        switch (user.role) {
          case 'manager':
          case 'director':
            endpoint = `/api/visual-concept?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/visual-concept';
            break;
          default:
            console.error('Rol no autorizado:', user.role);
            return;
        }
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Error al obtener conceptos visuales');
        }
        const data = await response.json();
        // Obtener grupos
        const groupRes = await fetch('http://localhost:3000/api/group');
        const groupData = await groupRes.json();
        const groups = groupData.data || [];
        // Mapear grupo por idConceptVisual (asumiendo que cada grupo tiene un campo idConceptVisual)
        const formattedData = data.data.map((conceptVisual: any, index: number) => {
          // Asociar grupo por posición (index)
          const grupo = groups[index];
          return {
            id: conceptVisual.id ?? index,
            picture: conceptVisual.picture,
            groupName: grupo ? grupo.name : null
          };
        });
        setConceptVisualRows(formattedData);
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
      const token = localStorage.getItem('token');
      const formData = new FormData();
      // Solo esperamos un campo: image (puede venir como File o FileList)
      if (updatedRow.image instanceof File) {
        formData.append('image', updatedRow.image);
      } else if (updatedRow.image && updatedRow.image[0] instanceof File) {
        formData.append('image', updatedRow.image[0]);
      }

      const response = await fetch(`http://localhost:3000/api/visual-concept/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
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
          {/* Carrusel Swiper de conceptos visuales */}
          {conceptVisualRows.length > 0 && (() => {
            console.log('conceptVisualRows:', conceptVisualRows);
            const slides = conceptVisualRows.map((row, idx) => ({
              id: row.id,
              name: row.groupName ? row.groupName : `Concepto #${idx + 1}`,
              src: row.picture
                ? (row.picture.startsWith('http')
                    ? row.picture
                    : row.picture.startsWith('visual-concepts/')
                        ? `/${row.picture}`
                        : `/visual-concepts/${row.picture}`)
                : '',
            }));
            console.log('slides para Carousel:', slides);
            return (
              <Carousel
                slides={slides}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            );
          })()}
          {/* ConfirmDialog y Modal con z-index alto para prioridad visual */}
          <div style={{ position: 'fixed', zIndex: 20000, top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
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
            </div>
          </div>
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
          <Modal
            isOpen={showEditModal}
            title="Editar Concepto Visual"
            data={editRow}
            constraints={visualConceptConstraints}
            onSave={async (updatedRow: any) => {
              setShowEditModal(false);
              await handleEditSave(updatedRow);
            }}
            onClose={() => setShowEditModal(false)}
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
