/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import Calendar from '../../components/calendar/Calendar';
import PageLayout from '../../components/pageLayout/PageLayout';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import { useAuth } from '../../contexts/auth/AuthContext';
import { activityConstraints } from '../../config/modalConstraints';
import './Activities.css';
import ModalCreate from '../../components/modal/ModalCreate';

const Activities: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<any | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clickedDate, setClickedDate] = useState<string | null>(null)
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [successContext, setSuccessContext] = useState<string | null>(null);
  const [lastCreatedActivity, setLastCreatedActivity] = useState<any | null>(null);
  const [openAcceptActivity, setOpenAcceptActivity] = useState(false);
  const [openRejectActivity,setOpenRejectActivity] = useState(false);
  const [openConfirmAcceptActivity,setOpenConfirmAcceptActivity] = useState(false);
  const [openConfirmRejectActivity,setOpenConfirmRejectActivity] = useState(false);


  const updateDate = (date: string) => {
    setClickedDate(date)
    console.log(clickedDate)
  }


  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        let endpoint = '';

        // Switch case según el rol del usuario
        switch (user.role) {
          case 'artist':
            // Actividades del artista específico
            endpoint = `/api/activity/${user.profileData?.IdAp}&${user.profileData?.IdGr}`;
            break;

          case 'manager':
          case 'director':
            // Todas las actividades de todos los artistas de la agencia del manager o director
            endpoint = `/api/activity?agencyId=${user.agencyId}`;
            console.log("endpoint",endpoint)
            break;

          case 'admin':
            // Todas las actividades del sistema
            endpoint = '/api/activity';
            break;

          default:
            console.error('Rol no reconocido:', user.role);
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
          throw new Error('Error al obtener actividades');
        }

        const data = await response.json();
        console.log(data.data)
        const formattedData = data.data.map((activity: any, index: number) => ({
          id: activity.id ?? index,
          eventType: activity.eventType,
          activityType: activity.activityType,
          date: activity.date,
          place: activity.place,
          responsible: activity.responsible,
          status : activity.status
        }))
        setActivities(formattedData);
        console.log(formattedData)

        // ============================================
        // FIN SECCIÓN: BACKEND ENDPOINT
        // ============================================


      } catch (error) {
        console.error('Error al cargar actividades:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  const askConfirm = (id: number) => {
    setSelectedActivity(id)
    setOpenConfirmAcceptActivity(true)
  }
  const askCancelled = (id: number) => {
    setSelectedActivity(id)
    setOpenConfirmRejectActivity(true)
  }

  const handleDelete = async () => {
    if (activityToDelete === null) return;
    try {
      const response = await fetch(`http://localhost:3000/api/activities/${activityToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar actividad');
      }

      setActivities(prev => prev.filter(activity => activity.id !== activityToDelete));
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al eliminar actividad');
      setOpenError(true);
    } finally {
      setOpenConfirm(false);
      setActivityToDelete(null);
    }
  };

  const handleCreateSaveActivity = async (newactivity: any) => {
    try {
      console.log('newactivity', newactivity)

      // Obtener el nombre de la agencia usando el id
      let agencyName = '';
      console.log('user', user)
      if (user?.profileData?.agencyId) {
        const res = await fetch('http://localhost:3000/api/agency', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        const agencies = Array.isArray(data.data) ? data.data : [];
        const found = agencies.find((a: any) => Number(a.id) === Number(user.profileData?.agencyId));
        console.log('found', found)
        agencyName = found ? found.name : '';
      }
      console.log('agencyName', agencyName);


      // Separar performers en groups y artists
      const performers = Array.isArray(newactivity.performer) ? newactivity.performer : [];
      console.log("performers", performers);
      const groups = performers
        .filter((p: any) => p.type === 'group' && p.memberId)
        .map((p: any) => {
          return Number(p.memberId);
        });
      const artists = performers
        .filter((p: any) => p.type === 'artist' && p.memberId)
        .map((p: any) => {
          let ids = p.memberId;
          if (typeof ids === 'string') {
            ids = ids.split(',').map(Number);
          }
          return Array.isArray(ids) && ids.length === 2 ? ids : [null, null];
        });
      console.log("performers", performers);
      console.log("groups", groups);
      console.log("artists", artists);

      const mapActivityType = (type: string) => {
        if (type === 'grupal' || type === 'Groups') return 'GROUP';
        if (type === 'individual') return 'INDIVIDUAL';
        return '';
      };
      const payload = {
        eventType: newactivity.eventType || newactivity.typeEvent,
        activityType: mapActivityType(newactivity.activityType || newactivity.type),
        date: clickedDate,
        place: newactivity.place,
        responsible: agencyName,
        groups: groups,
        artists: artists
      }
      console.log('payload', payload);
      const response = await fetch('http://localhost:3000/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      console.log('response', response)
      if (!response.ok) {
        throw new Error('Error al crear actividad');
      }

      const result = await response.json();
      const createdActivity = result.data || result; // <-- Guarda la actividad creada aquí
      console.log('actividad creada', createdActivity)
      setActivities(prev => [...prev, createdActivity]);
      setLastCreatedActivity(createdActivity);
      setSuccessContext('activity');
      setOpenAccept(true);

    } catch (error) {
      console.error('Error al crear actividad:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al crear actividad');
      setOpenError(true);
    }
  };

  const handleCreateSaveIncome = async (newincome: any) => {
    try {
      const payload = {
        amount: Number(newincome.amount),
        description: newincome.incomeType,
        idActivity: lastCreatedActivity.id
      };
      console.log('payload', payload);
      const response = await fetch('http://localhost:3000/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Error al crear ingreso asociado a esta actividad');
      }

      const result = await response.json();
      setIncomes(prev => [...prev, (result.data || result)]);
      setShowIncomeModal(false);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al asociarle ingreso a actividad:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al asociarle ingreso a actividad');
      setOpenError(true);
    }
  };

  // Validar actividad (para artistas)
  const handleAcceptActivity = async () => {
    if (!selectedActivity) return;

    try {
      console.log(user)
      const response = await fetch(`http://localhost:3000/api/activity/${selectedActivity}/decision`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ accepted: true, apprenticeId: user.profileData.IdAp, groupId: user.profileData.IdGr }),

      });
      console.log(response)
      if (!response.ok) {
        throw new Error('Error al aceptar actividad');
      }

      // Actualizar estado local
      setActivities(prev =>
        prev.map(a => a.id === selectedActivity.id ? { ...a, status: 'confirmed' } : a)
      );
      setOpenAcceptActivity(true);
    } catch (error) {
      console.error('Error al aceptar actividad:', error);
    }finally{
      setOpenConfirmAcceptActivity(false)
      setSelectedActivity(null);
    }
  };

  const handleRejectActivity = async () => {
    if (!selectedActivity) return;
    console.log(selectedActivity)

    try {
      console.log(selectedActivity)
      const response = await fetch(`http://localhost:3000/api/activity/${selectedActivity}/decision`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ accepted: false, apprenticeId: user.profileData.IdAp, groupId: user.profileData.IdGr }),
      });

      if (!response.ok) {
        throw new Error('Error al rechazar actividad');
      }

      // Actualizar estado local
      setActivities(prev =>
        prev.map(a => a.id === selectedActivity.id ? { ...a, status: 'cancelled' } : a)
      );
      setOpenRejectActivity(true);
    } catch (error) {
      console.error('Error al rechazar actividad:', error);
    }finally{
      setOpenConfirmRejectActivity(false)
      setSelectedActivity(null);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  const handleExportPdf = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/export/activities', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al exportar PDF');
      }


      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);


      const a = document.createElement('a');
      a.href = url;
      a.download = 'actividades.pdf';
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Error al exportar PDF'
      );
      setOpenError(true);
    }
  };

  return (
    <PageLayout
      title="Actividades"
      description={
        user.role === 'artist' ? 'Consulta y valida todas tus actividades programadas (conciertos, ensayos, grabaciones, etc.)' :
          user.role === 'manager' ? 'Gestiona y programa actividades para todos los artistas de tu agencia' :
            user.role === 'director' ? 'Supervisa todas las actividades programadas de los artistas de la agencia' :
              user.role === 'admin' ? 'Vista global de todas las actividades del sistema' :
                'Gestión de actividades'
      }
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando actividades...
        </div>
      ) : (
        <>
          {user.role === 'artist' && (
            <div className="activities-layout">
              {/* Calendario a la izquierda */}
              <div className="calendar-section">
                <Calendar
                  activitiesTest={activities}
                  onExport={() => console.log("Exportando")}
                  isArtist={true}
                  onAcept={askConfirm}
                  onCancel={askCancelled}
                />
              </div>
            </div>
          )}
          {(user.role === 'manager' || user.role === 'director' || user.role === 'admin') && (
            <div className="manager-view">
              <div className="activities-layout">
                {/* Calendario a la izquierda */}
                <div className="calendar-section">
                  <Calendar
                    activitiesTest={activities}
                    onExport={handleExportPdf}
                    isArtist={false}
                    onUpdateDate={updateDate}
                    onCreateActivity={handleCreateSaveActivity}
                    clickedDate={clickedDate ?? undefined}
                  />
                </div>
              </div>
            </div>
          )}
          <ConfirmDialog
            message="¿Está seguro que desea eliminar esta actividad?"
            open={openConfirm}
            onCancel={() => setOpenConfirm(false)}
            onConfirm={handleDelete}
            type="confirm"
          />
          <ConfirmDialog
            title="¡Éxito!"
            message="La actividad ha sido registrada correctamente"
            open={openAccept}
            type="success"
            onCancel={() => {
              setOpenAccept(false);
              if (successContext === 'activity') {
                setShowIncomeModal(true);
                setSuccessContext(null);
              }
            }}
            onConfirm={() => {
              setOpenAccept(false);
              if (successContext === 'activity') {
                setShowIncomeModal(true);
                setSuccessContext(null);
              }
            }}
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
          {/* Para mostrar mensaje al aceptar o rechazar actividad */}
          <ConfirmDialog
                  type="success"
                  title="Exito"
                  message="Se ha aceptado la actividad"
                  open={openAcceptActivity}
                  onCancel={() => setOpenAcceptActivity(false)}
                  onConfirm={() => setOpenAcceptActivity(false)}
                  confirmText="Aceptar"
                  showDeleteButton={false}
            />
            <ConfirmDialog
                    title=" "
                    message="Actividad Rechazada"
                    type="error"
                    open={openRejectActivity}
                    onCancel={() => setOpenRejectActivity(false)}
                    onConfirm={() => setOpenRejectActivity(false)}
                    confirmText="Aceptar"
                    showDeleteButton={false} />
            <ConfirmDialog 
            message="¿Está seguro que desea aceptar esta actividad?"
            open={openConfirmAcceptActivity}
            onCancel={() => setOpenConfirmAcceptActivity(false)}
            onConfirm={handleAcceptActivity}
            type='confirm'
            />
            <ConfirmDialog
            message="¿Está seguro que desea rechazar esta actividad?"
            open={openConfirmRejectActivity}
            onCancel={() => setOpenConfirmRejectActivity(false)}
            onConfirm={handleRejectActivity}
            type='confirm'
            />
        </>
      )}
      {showIncomeModal && (
        <ModalCreate
          isOpen={showIncomeModal}
          onClose={() => setShowIncomeModal(false)}
          title="Registrar ingreso"
          createEntity="income"
          onSave={handleCreateSaveIncome}
        />
      )}
    </PageLayout>
  );
};

export default Activities;