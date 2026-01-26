/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/pageLayout/PageLayout';
import ModalCreate from '../../components/modal/ModalCreate';
import Modal from '../../components/modal/Modal';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import { useAuth } from '../../contexts/auth/AuthContext';
import { popularityListFields } from '../../config/formSource';
import PopuList from '../../components/List/PopuList';
import { popularityListConstraints } from '../../config/modalConstraints';

const PopularityLists: React.FC = () => {
  const { user } = useAuth();
  const [popularityListsRows, setPopularityListsRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [popularityListToDelete, setPopularityListToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPopularityLists = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        switch (user.role) {
          case 'manager':
          case 'director':
            endpoint = `/api/populist?agencyId=${user.agencyId}`;
            break;
          case 'admin':
            endpoint = '/api/populist';
            break;
          case 'artist':
            endpoint = '/api/populist'
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
          throw new Error('Error al obtener listas de popularidad');
        }

        const data = await response.json();
        console.log(data);
        const formattedData = data.data.map((popularityList: any, index: number) => ({
          id: popularityList.id ?? index,
          name: popularityList.name,
          listType: popularityList.listType,
          songs: popularityList.songs
        }));
        console.log(formattedData);
        setPopularityListsRows(formattedData);
        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================

      } catch (error) {
        console.error('Error al cargar listas de popularidad:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularityLists();
  }, [user]);

  const askDelete = (id: number) => {
    setPopularityListToDelete(id);
    setOpenConfirm(true);
  };

  const handleDelete = async () => {
    if (popularityListToDelete === null) return;

    try {
      const response = await fetch(`http://localhost:3000/api/populist/${popularityListToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar registro de lista de popularidad');
      }

      setPopularityListsRows(prev => prev.filter(popularityList => popularityList.id !== popularityListToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar registro de lista de popularidad:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar registro de lista de popularidad');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setPopularityListToDelete(null);
    }
  };

  const handleEditSave = async (updatedRow: any) => {
    try {
      const response = await fetch(`http://localhost:3000/api/populist/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar registro de lista de popularidad');
      }

      const data = await response.json();
      setPopularityListsRows(prev =>
        prev.map(popularityList => popularityList.id === updatedRow.id ? (data.data || data) : popularityList)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar registro de lista de popularidad:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar lista de popularidad');
      setOpenError(true);
    }
  };

  const handleCreateSave = (data: any) => {
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else Object.assign(payload, data);
    if (payload.requirement !== undefined) {
  payload.requirement = Number(payload.requirement);
}

    (async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const url = `${API_BASE}/api/populist`;
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear lista de popularidad';
          try {
            const txt = await res.text();
            try { const j = JSON.parse(txt); msg = j?.message || j?.error || txt || msg; }
            catch { msg = txt || msg; }
          } catch (error) { 
            setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar agencia');
            setOpenError(true);
          }
          console.error('Error al crear lista de popularidad:', msg);
          return;
        }

        const result = await res.json().catch(() => null);
        if (result?.data) {
          setPopularityListsRows(prev => [...prev, result.data]);
        }
        setOpenAccept(true);
      } catch (err) {
        console.error('Error creando lista de popularidad:', err);
      }
    })();
  };

  const handleFormSubmit = async (formData: Record<string, any>) => {
    try {
      const response = await fetch('http://localhost:3000/api/popularity-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al crear lista de popularidad');
      }

      const data = await response.json();
      setPopularityListsRows(prev => [...prev, (data.data || data)]);
      setShowCreateModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear lista:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error al crear lista de popularidad';
      setErrorMessage(errorMsg);
      setShowCreateModal(false);
      setOpenError(true);
    }
  };

  if (!user || (user.role !== 'artist' && user.role !== 'manager' && user.role !== 'director' && user.role !== 'admin')) {
    return (
      <PageLayout title="Listas de Popularidad" description="No tienes permisos para ver esta página">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No tienes acceso a esta sección.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Listas de Popularidad"
      description={
        user.role === 'admin' ? 'Vista global de todas las listas de popularidad del sistema' :
          user.role === 'director' ? 'Todas las listas de popularidad de tu agencia' :
            user.role === 'manager' ? 'Gestiona las listas de popularidad de tu agencia' :
              user.role !== 'artist' ? 'Listas de popularidad' :
                'Gestiona tus listas de popularidad'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando listas de popularidad...
        </div>
      ) : (
        <>
          <PopuList charts={popularityListsRows} 
          createEntity='popularityList' 
          onCreateSave={handleCreateSave}
          onDelete={askDelete}
          onEditSave={handleEditSave}
          constraints={popularityListConstraints}
          showCreateButton = {user?.role === 'admin'}>
          </PopuList>
          <ModalCreate
            isOpen={showCreateModal}
            title="Crear Lista de Popularidad"
            createFields={popularityListFields}
            onSave={handleFormSubmit}
            onClose={() => setShowCreateModal(false)}
          />
          <Modal
            isOpen={showSuccessModal}
            title="Lista de Popularidad creada exitosamente"
            onSave={() => setShowSuccessModal(false)}
            onClose={() => setShowSuccessModal(false)}
          />
          <ConfirmDialog
            message="¿Está seguro que desea eliminar este registro de lista de popularidad?"
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={handleDelete}
            type="confirm"
          />
          <ConfirmDialog
            title="¡Éxito!"
            message="Operación realizada correctamente"
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

export default PopularityLists;