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

interface EvaluationRow {
  id: string;
  apprentice: string;
  agency: string;
  evaluationDate: string;
  score: number;
}

const Evaluations: React.FC = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<EvaluationRow[]>([]);
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
    { field: 'apprentice', headerName: 'Aprendiz', width: 180 },
    { field: 'agency', headerName: 'Agencia', width: 180 },
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
      field: 'evaluationDate',
      headerName: 'Fecha de Evaluación',
      width: 150,
      valueFormatter: (params: { value: string }) => {
        return new Date(params.value).toLocaleDateString('es-ES');
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
        // ============================================
        const response = await fetch(`http://localhost:3000/api/apprentice/${apprenticeId}/evaluations`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener evaluaciones');
        }

        const data = await response.json();
        // Mapear los datos del backend al formato de la tabla
        const rows = (data.data || data).map((item: any) => ({
          id: `${item.apprenticeId}-${item.agencyId}-${item.evaluationDate}`,
          apprentice: item.apprentice?.fullName || item.apprenticeId,
          agency: item.agency?.name || item.agencyId,
          evaluationDate: item.evaluationDate,
          score: item.score
        }));
        setEvaluations(rows);
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

      setEvaluations(prev => prev.filter(evaluation => evaluation.id !== String(evaluationToDelete)));
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

  const handleEditSave = async (updatedRow: EvaluationRow) => {
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

  // Maneja el guardado del formulario de creación de evaluación
  const handleCreateSave = async (formData: Record<string, any>) => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }
      const apprenticeId = user.profileData?.apprenticeId || user.id;
      const response = await fetch(`http://localhost:3000/api/apprentice/${apprenticeId}/evaluations`, {
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
      setShowSuccessModal(true); // Mostrar modal de éxito al crear
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
            onSave={handleCreateSave}
            onClose={() => setShowCreateModal(false)}
          />
          <Modal
            isOpen={showSuccessModal}
            title="Evaluación creada exitosamente"
            onSave={() => setShowSuccessModal(false)}
            onClose={() => setShowSuccessModal(false)}
          />
          <ConfirmDialog
            message="¿Está seguro que desea eliminar esta evaluación?"
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={handleDelete}
            type="confirm"
          />
          <ConfirmDialog
            title="¡Éxito!"
            message="La evaluación ha sido registrada correctamente"
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

export default Evaluations;
