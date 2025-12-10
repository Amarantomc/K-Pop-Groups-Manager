import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Calendar from '../../components/calendar/Calendar';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import { useAuth } from '../../contexts/auth/AuthContext';
import { activityConstraints } from '../../config/modalConstraints';
import './Activities.css';

interface Activity {
  id: number;
  artistName: string;
  groupName: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
}

const Activities: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openAccept, setOpenAccept] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const askDelete = (id: number) => {
    setActivityToDelete(id);
    setOpenConfirm(true);
  };

  // Columnas del DataTable para Manager/Director
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'responsible', headerName: 'Responsable', width: 180 },
    { field: 'activityType', headerName: 'Tipo de Actividad', width: 150 },
    {
      field: 'date',
      headerName: 'Fecha',
      width: 120,
      valueFormatter: (params) => new Date(params).toLocaleDateString('es-ES')
    },
    { field: 'place', headerName: 'Lugar', width: 180 },
    { field: 'eventType', headerName: 'Tipo de Evento', width: 180 }
  ];

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
            endpoint = `/api/activity?artistId=${user.profileData?.artistId || user.id}`;
            break;

          case 'manager':
          case 'director':
            // Todas las actividades de todos los artistas de la agencia del manager o director
            endpoint = `/api/activity?agencyId=${user.agencyId}`;
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
        const formattedData = data.data.map((activity : any , index : number) => ({
                        id : activity.id?? index,
                        type : activity.activityType,
                        location : activity.address,
                        founded : activity.foundation
                    }))
        setActivities(formattedData);

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

  const handleEditSave = async (updatedRow: Activity) => {
    try {
      const response = await fetch(`http://localhost:3000/api/activities/${updatedRow.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedRow)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar actividad');
      }

      const data = await response.json();
      setActivities(prev =>
        prev.map(activity => activity.id === updatedRow.id ? (data.data || data) : activity)
      );
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al actualizar actividad');
      setOpenError(true);
    }
  };

  const handleCreateSave = async (newRow: Omit<Activity, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3000/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newRow)
      });

      if (!response.ok) {
        throw new Error('Error al crear actividad');
      }

      const data = await response.json();
      setActivities(prev => [...prev, (data.data || data)]);
      setOpenAccept(true);
    } catch (error) {
      console.error('Error al crear actividad:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error al crear actividad');
      setOpenError(true);
    }
  };

  // Manejar selección de fecha en el calendario
  const handleDateClick = (date: string) => {
    const activity = activities.find(a => a.date === date);
    if (activity) {
      setSelectedActivity(activity);
    }
  };

  // Validar actividad (para artistas)
  const handleAcceptActivity = async () => {
    if (!selectedActivity) return;

    try {
      const response = await fetch(`http://localhost:3000/api/activities/${selectedActivity.id}/validate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ validated: true })
      });

      if (!response.ok) {
        throw new Error('Error al aceptar actividad');
      }

      // Actualizar estado local
      setActivities(prev =>
        prev.map(a => a.id === selectedActivity.id ? { ...a, status: 'confirmed' } : a)
      );
      setSelectedActivity({ ...selectedActivity, status: 'confirmed' });
    } catch (error) {
      console.error('Error al aceptar actividad:', error);
    }
  };

  const handleRejectActivity = async () => {
    if (!selectedActivity) return;

    try {
      const response = await fetch(`http://localhost:3000/api/activities/${selectedActivity.id}/validate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ validated: false })
      });

      if (!response.ok) {
        throw new Error('Error al rechazar actividad');
      }

      // Actualizar estado local
      setActivities(prev =>
        prev.map(a => a.id === selectedActivity.id ? { ...a, status: 'cancelled' } : a)
      );
      setSelectedActivity({ ...selectedActivity, status: 'cancelled' });
    } catch (error) {
      console.error('Error al rechazar actividad:', error);
    }
  };

  // Obtener color según tipo de actividad
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'concert': '#8b5cf6',
      'rehearsal': '#3b82f6',
      'recording': '#ef4444',
      'promotion': '#f59e0b',
      'meeting': '#10b981'
    };
    return colors[type] || '#6b7280';
  };

  // Obtener color según estado
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': '#f59e0b',
      'confirmed': '#10b981',
      'cancelled': '#ef4444',
      'completed': '#6366f1'
    };
    return colors[status] || '#6b7280';
  };

  // Traducir tipo de actividad
  const translateType = (type: string) => {
    const translations: Record<string, string> = {
      'concert': 'Concierto',
      'rehearsal': 'Ensayo',
      'recording': 'Grabación',
      'promotion': 'Promoción',
      'meeting': 'Reunión'
    };
    return translations[type] || type;
  };

  // Traducir estado
  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada',
      'completed': 'Completada'
    };
    return translations[status] || status;
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  // Convertir actividades a formato del calendario
  const calendarEvents = activities.map(activity => ({
    id: activity.id,
    date: activity.date,
    title: activity.title,
    artist: activity.artistName, // <-- Añadido para cumplir con EventItem
    subtitle: `${activity.time} - ${activity.artistName}`,
    color: activity.type,
    time: activity.time,
    //type: activity.activityType
  }));

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
                  activities={calendarEvents}
                  onDateClick={handleDateClick}
                />
              </div>

              {/* Panel de detalles a la derecha - solo visible cuando hay selección */}
              {selectedActivity && (
                <div className="details-section">
                  <div className="activity-details">
                    <div className="activity-header">
                      <h2 className="activity-title">{selectedActivity.title}</h2>
                      <span
                        className="activity-type-badge"
                        style={{ backgroundColor: getTypeColor(selectedActivity.type) }}
                      >
                        {translateType(selectedActivity.type)}
                      </span>
                    </div>

                    <div className="activity-info-grid">
                      <div className="info-item">
                        <span className="info-label">Fecha</span>
                        <span className="info-value">
                          {new Date(selectedActivity.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Hora</span>
                        <span className="info-value">{selectedActivity.time}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Ubicación</span>
                        <span className="info-value">{selectedActivity.location}</span>
                      </div>

                      <div className="info-item">
                        <span className="info-label">Estado</span>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: getStatusColor(selectedActivity.status),
                            color: 'white'
                          }}
                        >
                          {translateStatus(selectedActivity.status)}
                        </span>
                      </div>

                      {selectedActivity.groupName && (
                        <div className="info-item">
                          <span className="info-label">Grupo</span>
                          <span className="info-value">{selectedActivity.groupName}</span>
                        </div>
                      )}
                    </div>

                    {selectedActivity.description && (
                      <div className="activity-description">
                        <h4>Descripción</h4>
                        <p>{selectedActivity.description}</p>
                      </div>
                    )}

                    {/* Botones de validación para artistas */}
                    {selectedActivity.status === 'pending' && (
                      <div className="validation-buttons">
                        <button
                          className="validation-btn accept-btn"
                          onClick={handleAcceptActivity}
                        >
                          <CheckCircleIcon />
                          Aceptar Actividad
                        </button>
                        <button
                          className="validation-btn reject-btn"
                          onClick={handleRejectActivity}
                        >
                          <CancelIcon />
                          Rechazar Actividad
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {(user.role === 'manager' || user.role === 'director' || user.role === 'admin') && (
            <div className="manager-view">
              <div className="activities-layout">
                {/* Calendario a la izquierda */}
                <div className="calendar-section">
                  <Calendar
                    activities={calendarEvents}
                    onDateClick={handleDateClick}
                  />
                </div>

                {/* Panel de detalles a la derecha - solo visible cuando hay selección */}
                {selectedActivity && (
                  <div className="details-section">
                    <div className="activity-details">
                      <div className="activity-header">
                        <h2 className="activity-title">{selectedActivity.title}</h2>
                        <span
                          className="activity-type-badge"
                          style={{ backgroundColor: getTypeColor(selectedActivity.type) }}
                        >
                          {translateType(selectedActivity.type)}
                        </span>
                      </div>

                      <div className="activity-info-grid">
                        <div className="info-item">
                          <span className="info-label">Artista</span>
                          <span className="info-value">{selectedActivity.artistName}</span>
                        </div>

                        <div className="info-item">
                          <span className="info-label">Grupo</span>
                          <span className="info-value">{selectedActivity.groupName}</span>
                        </div>

                        <div className="info-item">
                          <span className="info-label">Fecha</span>
                          <span className="info-value">
                            {new Date(selectedActivity.date).toLocaleDateString('es-ES', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="info-item">
                          <span className="info-label">Hora</span>
                          <span className="info-value">{selectedActivity.time}</span>
                        </div>

                        <div className="info-item">
                          <span className="info-label">Ubicación</span>
                          <span className="info-value">{selectedActivity.location}</span>
                        </div>

                        <div className="info-item">
                          <span className="info-label">Estado</span>
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(selectedActivity.status),
                              color: 'white'
                            }}
                          >
                            {translateStatus(selectedActivity.status)}
                          </span>
                        </div>
                      </div>

                      {selectedActivity.description && (
                        <div className="activity-description">
                          <h4>Descripción</h4>
                          <p>{selectedActivity.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Lista de actividades debajo */}
              <div className="datatable-section">
                { /* <h3>Lista de Actividades</h3>
              <DataTable
                  columns={columns}
                  rows={activities}
                  pagesize={10}
                  onDelete={askDelete}
                  onEditSave={handleEditSave}
                  onCreateSave={handleCreateSave}
                  showEditButton={true}
                  constraints={activityConstraints}
                  createEntity="activity"
                  userRole={user?.role}
                />*/}
              </div>
            </div>
          )}
          <ConfirmDialog
            message="¿Está seguro de que desea eliminar esta actividad?"
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

export default Activities;
