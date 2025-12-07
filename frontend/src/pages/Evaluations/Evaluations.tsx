import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import { useAuth } from '../../contexts/auth/AuthContext';
import { evaluationFields } from '../../config/formSource';
import { evaluationConstraints } from '../../config/modalConstraints';

interface Evaluation {
  id: number;
  apprenticeName: string;
  evaluatorName: string;
  score: number;
  category: string;
  comments: string;
  evaluationDate: string;
}

const Evaluations: React.FC = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [evaluationToDelete, setEvaluationToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Columnas del DataTable
  const columns: GridColDef[] = [
    { field: 'apprenticeName', headerName: 'Aprendiz', width: 180 },
    { field: 'evaluatorName', headerName: 'Evaluador', width: 180 },
    {
      field: 'category',
      headerName: 'Categoría',
      width: 150
    },
    {
      field: 'score',
      headerName: 'Puntuación',
      width: 120,
      renderCell: (params) => {
        const score = params.value as number;
        const color = score >= 8 ? '#10b981' : score >= 6 ? '#f59e0b' : '#ef4444';
        return (
          <span style={{
            color: color,
            fontWeight: 600,
            fontSize: '16px'
          }}>
            {score}/10
          </span>
        );
      }
    },
    {
      field: 'comments',
      headerName: 'Comentarios',
      width: 250,
      renderCell: (params) => (
        <div style={{
          whiteSpace: 'normal',
          lineHeight: '1.4',
          padding: '8px 0'
        }}>
          {params.value}
        </div>
      )
    },
    {
      field: 'evaluationDate',
      headerName: 'Fecha de Evaluación',
      width: 150,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    }
  ];

  useEffect(() => {
    const fetchEvaluations = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        // Obtener el apprenticeId del usuario actual
        const apprenticeId = user.profileData?.apprenticeId || user.id;

        // ============================================
        // SECCIÓN: BACKEND ENDPOINT
        // Descomenta esta sección para usar el backend real
        // ============================================
        const response = await fetch(`http://localhost:3000/api/evaluations?apprenticeId=${apprenticeId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener evaluaciones');
        }

        const data = await response.json();
        setEvaluations(data.data || data);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

        //============================================
        /// SECCIÓN: DATOS DEMO
        //============================================
        /*
        const mockEvaluations: Evaluation[] = [
          {
            id: 1,
            apprenticeName: user.name || 'Kim Ji-soo',
            evaluatorName: 'Park Min-jung',
            score: 9,
            category: 'Vocal',
            comments: 'Excelente técnica vocal, muestra gran progreso en el rango alto',
            evaluationDate: '2025-11-28T10:00:00'
          },
          {
            id: 2,
            apprenticeName: user.name || 'Kim Ji-soo',
            evaluatorName: 'Lee Tae-min',
            score: 7,
            category: 'Baile',
            comments: 'Buen ritmo, necesita trabajar en la sincronización con el grupo',
            evaluationDate: '2025-11-25T14:30:00'
          },
          {
            id: 3,
            apprenticeName: user.name || 'Kim Ji-soo',
            evaluatorName: 'Choi Yuna',
            score: 8,
            category: 'Expresión Escénica',
            comments: 'Demuestra carisma natural, muy conectado con el público',
            evaluationDate: '2025-11-22T16:00:00'
          },
          {
            id: 4,
            apprenticeName: user.name || 'Kim Ji-soo',
            evaluatorName: 'Kim Soo-hyun',
            score: 6,
            category: 'Rap',
            comments: 'Necesita mejorar dicción y fluidez, pero tiene potencial',
            evaluationDate: '2025-11-20T11:15:00'
          }
        ];

        setEvaluations(mockEvaluations);
        */
        // ============================================
        //FIN SECCIÓN: DATOS DEMO
        // ============================================ 

      } catch (error) {
        console.error('Error al cargar evaluaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, [user]);

  const askDelete = (id: number) => {
    setEvaluationToDelete(id);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    if (evaluationToDelete === null) return;

    try {
      const response = await fetch(`http://localhost:3000/api/evaluations/${evaluationToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar evaluación');
      }

      setEvaluations(prev => prev.filter(evaluation => evaluation.id !== evaluationToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar evaluación:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar evaluación');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setEvaluationToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: Evaluation) => {
    try {
      const response = await fetch(`http://localhost:3000/api/evaluations/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar evaluación');
      }

      const data = await response.json();
      setEvaluations(prev =>
        prev.map(evaluation => evaluation.id === updatedRow.id ? (data.data || data) : evaluation)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar evaluación:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar evaluación');
      setOpenError(true);
    }
  };

  const handleCreateSave = async (newRow: Omit<Evaluation, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3000/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRow)
      });

      if (!response.ok) {
        throw new Error('Error al crear evaluación');
      }

      const data = await response.json();
      setEvaluations(prev => [...prev, (data.data || data)]);
    } catch (error) {
      console.error('Error al crear evaluación:', error);
    }
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:3000/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear evaluación');
      }

      const data = await response.json();
      setEvaluations(prev => [...prev, (data.data || data)]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear evaluación:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear evaluación';
      setErrorMessage(errorMsg);
      setShowCreateModal(false);
      setOpenError(true);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <PageLayout
      title="Evaluaciones"
      description="Consulta todas las evaluaciones recibidas y el progreso en diferentes categorías (Vocal, Baile, Expresión Escénica, etc.)"
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando evaluaciones...
        </div>
      ) : (
        <>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              marginBottom: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            + Añadir Evaluación
          </button>
          <DataTable
            columns={columns}
            rows={evaluations}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            showEditButton={false}
            constraints={evaluationConstraints}
            createEntity="evaluation"
            userRole={user?.role}
          />
          <ModalCreate
            isOpen={showCreateModal}
            title="Crear Evaluación"
            createFields={evaluationFields}
            onSave={handleFormSubmit}
            onClose={() => setShowCreateModal(false)}
          />
          <Modal
            isOpen={showSuccessModal}
            title="Evaluación creada exitosamente"
            onSave={() => setShowSuccessModal(false)}
            onClose={() => setShowSuccessModal(false)}
          />
          <ConfirmDialog
            message="¿Está seguro de que desea eliminar esta evaluación?"
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

export default Evaluations;
