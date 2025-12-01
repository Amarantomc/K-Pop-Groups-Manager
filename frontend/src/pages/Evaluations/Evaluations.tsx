import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../contexts/auth/AuthContext';

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

        /* DATOS DE PRUEBA - COMENTADO
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

      } catch (error) {
        console.error('Error al cargar evaluaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/evaluations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar evaluación');
      }

      setEvaluations(prev => prev.filter(evaluation => evaluation.id !== id));
    } catch (error) {
      console.error('Error al eliminar evaluación:', error);
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
    } catch (error) {
      console.error('Error al actualizar evaluación:', error);
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
        <DataTable
          columns={columns}
          rows={evaluations}
          pagesize={10}
          onDelete={handleDelete}
          onEditSave={handleEditSave}
          showEditButton={false}
        />
      )}
    </PageLayout>
  );
};

export default Evaluations;
