import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import { useAuth } from '../../contexts/auth/AuthContext';
import { incomeFields } from '../../config/formSource';
import { incomeConstraints } from '../../config/modalConstraints';

interface Income {
  id: number;
  artistName: string;
  groupName: string;
  amount: number;
  source: string;
  description: string;
  incomeDate: string;
  agencyName?: string;
}

const Income: React.FC = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Columnas base del DataTable
  const baseColumns: GridColDef[] = [
    { field: 'artistName', headerName: 'Artista', width: 180 },
    { field: 'groupName', headerName: 'Grupo', width: 150 },
    {
      field: 'amount',
      headerName: 'Monto',
      width: 140,
      renderCell: (params) => {
        const amount = params.value as number;
        return (
          <span style={{
            color: '#10b981',
            fontWeight: 700,
            fontSize: '15px'
          }}>
            ${amount.toLocaleString('es-ES')}
          </span>
        );
      }
    },
    {
      field: 'source',
      headerName: 'Fuente',
      width: 150
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
          {params.value}
        </div>
      )
    },
    {
      field: 'incomeDate',
      headerName: 'Fecha',
      width: 130,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    }
  ];

  // Agregar columna de agencia solo para admin
  const columns = user?.role === 'admin'
    ? [...baseColumns, { field: 'agencyName', headerName: 'Agencia', width: 150 }]
    : baseColumns;

  useEffect(() => {
    const fetchIncomes = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'artist':
            endpoint = `/api/income?artistId=${user.profileData?.artistId || user.id}`;
            break;
          case 'manager':
            endpoint = `/api/income?agencyId=${user.agencyId}`;
            break;
          case 'director':
            endpoint = `/api/income?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/income';
            break;
          default:
            console.error('Rol no reconocido:', user.role);
            return;
        }

        // ============================================
        // SECCIÓN: BACKEND ENDPOINT
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener ingresos');
        }

        const data = await response.json();
        // Normalizar para que cada ingreso tenga 'id'
        const normalized = (data.data || data).map((income: any) => ({
          ...income,
          id: income.idIncome ?? income.id
        }));
        setIncomes(normalized);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

        //============================================
        // SECCIÓN: DATOS DEMO
        //============================================
        /*
        const mockIncomes: Income[] = [
          {
            id: 1,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Lee Min-ho',
            groupName: 'Phoenix',
            amount: 15000,
            source: 'Concierto',
            description: 'Presentación en Seoul Music Festival',
            incomeDate: '2025-11-28T19:00:00',
            agencyName: 'K-Pop Stars Agency'
          },
          {
            id: 2,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Kim Ji-soo',
            groupName: 'Starlight',
            amount: 8500,
            source: 'Streaming',
            description: 'Regalías de plataformas digitales - Noviembre',
            incomeDate: '2025-11-25T10:00:00',
            agencyName: 'K-Pop Stars Agency'
          },
          {
            id: 3,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Lee Min-ho',
            groupName: 'Phoenix',
            amount: 12000,
            source: 'Publicidad',
            description: 'Campaña publicitaria Samsung Galaxy',
            incomeDate: '2025-11-20T14:30:00',
            agencyName: 'K-Pop Stars Agency'
          },
          {
            id: 4,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Park Soo-young',
            groupName: 'Dreamers',
            amount: 5000,
            source: 'Venta de Merchandise',
            description: 'Ventas de productos oficiales - Mes de Noviembre',
            incomeDate: '2025-11-18T09:00:00',
            agencyName: 'Global Entertainment'
          },
          {
            id: 5,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Kim Ji-soo',
            groupName: 'Starlight',
            amount: 20000,
            source: 'Concierto',
            description: 'Tour Internacional - Tokio',
            incomeDate: '2025-11-15T20:00:00',
            agencyName: 'K-Pop Stars Agency'
          }
        ];

        // Filtrar según rol para la demo
        let filteredIncomes = mockIncomes;
        if (user.role === 'artist') {
          // Solo ingresos del artista actual
          filteredIncomes = mockIncomes.filter(income => income.id <= 3);
        } else if (user.role === 'manager' || user.role === 'director') {
          // Filtrar por agencia (en demo mostramos los de K-Pop Stars Agency)
          filteredIncomes = mockIncomes.filter(income => income.agencyName === 'K-Pop Stars Agency');
        }

        setIncomes(filteredIncomes);
        */
        // ============================================
        // FIN SECCIÓN: DATOS DEMO
        // ============================================ */

      } catch (error) {
        console.error('Error al cargar ingresos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncomes();
  }, [user]);

  const askDelete = (id: number) => {
    setIncomeToDelete(id);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    if (incomeToDelete === null) return;

    try {
      const response = await fetch(`http://localhost:3000/api/income/${incomeToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar ingreso');
      }

      setIncomes(prev => prev.filter(income => income.id !== incomeToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar ingreso:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar ingreso');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setIncomeToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: Income) => {
    try {
      const response = await fetch(`http://localhost:3000/api/income/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar ingreso');
      }

      const data = await response.json();
      const updated = data.data || data;
      setIncomes(prev =>
        prev.map(income => income.id === updatedRow.id ? {
          ...updated,
          id: updated.idIncome ?? updated.id
        } : income)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar ingreso:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar ingreso');
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

        const url = `${API_BASE}/api/income`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear ingreso';
          try {
            const txt = await res.text();
            try { const j = JSON.parse(txt); msg = j?.message || j?.error || txt || msg; }
            catch { msg = txt || msg; }
          } catch (e) {}
          console.error('Error al crear ingreso:', msg);
          return;
        }

        const result = await res.json().catch(() => null);
        if (result?.data) {
          const normalized = {
            ...result.data,
            id: result.data.idIncome ?? result.data.id
          };
          setIncomes(prev => [...prev, normalized]);
        }
        setOpenAccept(true);
      } catch (err) {
        console.error('Error creando ingreso:', err);
      }
    })();
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:3000/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear ingreso');
      }

      const data = await response.json();
      const newIncome = data.data || data;
      const normalized = {
        ...newIncome,
        id: newIncome.idIncome ?? newIncome.id
      };
      setIncomes(prev => [...prev, normalized]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear ingreso:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear ingreso';
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
      title="Ingresos"
      description={
        user.role === 'artist' ? 'Consulta tus ingresos generados por conciertos, streaming, publicidad y ventas de merchandise' :
          user.role === 'manager' ? 'Gestiona todos los ingresos de los artistas de tu agencia' :
            user.role === 'director' ? 'Supervisa todos los ingresos generados por los artistas de la agencia' :
              user.role === 'admin' ? 'Vista global de todos los ingresos del sistema (próximamente)' :
                'Gestión de ingresos'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando ingresos...
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={incomes}
            pagesize={10}
            onDelete={askDelete}
            onEditSave={handleEditSave}
            onCreateSave={handleCreateSave}
            showEditButton={user.role === 'manager' || user.role === 'director' || user.role === 'admin'}
            constraints={incomeConstraints}
            createEntity="income"
            userRole={user?.role}
            // onCreateClick={() => setShowCreateModal(true)}
          />
          <ModalCreate
            isOpen={showCreateModal}
            title="Crear Ingreso"
            createFields={incomeFields}
            onSave={handleFormSubmit}
            onClose={() => setShowCreateModal(false)}
          />
          <Modal
            isOpen={showSuccessModal}
            title="Ingreso creado exitosamente"
            onSave={() => setShowSuccessModal(false)}
            onClose={() => setShowSuccessModal(false)}
          />
          <ConfirmDialog
            message="¿Está seguro de que desea eliminar este ingreso?"
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

export default Income;
