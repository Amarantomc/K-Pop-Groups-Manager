import React, { useEffect, useState } from 'react';
import type { GridColDef } from '@mui/x-data-grid';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Calendar from '../../components/calendar/Calendar';
import DataTable from '../../components/datatable/Datatable';
import PageLayout from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../contextsLocal/AuthContext';
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

  // Columnas del DataTable para Manager/Director
  const columns: GridColDef[] = [
    { field: 'artistName', headerName: 'Artista', width: 150 },
    { field: 'groupName', headerName: 'Grupo', width: 130 },
    { field: 'title', headerName: 'Título', width: 180 },
    { 
      field: 'type', 
      headerName: 'Tipo', 
      width: 120,
      renderCell: (params) => {
        const typeColors: Record<string, string> = {
          'concert': '#8b5cf6',
          'rehearsal': '#3b82f6',
          'recording': '#ef4444',
          'promotion': '#f59e0b',
          'meeting': '#10b981'
        };
        return (
          <span style={{ 
            color: typeColors[params.value] || '#6b7280',
            fontWeight: 600 
          }}>
            {params.value === 'concert' ? 'Concierto' :
             params.value === 'rehearsal' ? 'Ensayo' :
             params.value === 'recording' ? 'Grabación' :
             params.value === 'promotion' ? 'Promoción' :
             params.value === 'meeting' ? 'Reunión' : params.value}
          </span>
        );
      }
    },
    { 
      field: 'date', 
      headerName: 'Fecha', 
      width: 120,
      valueFormatter: (params) => {
        return new Date(params).toLocaleDateString('es-ES');
      }
    },
    { field: 'time', headerName: 'Hora', width: 100 },
    { field: 'location', headerName: 'Ubicación', width: 150 },
    { 
      field: 'status', 
      headerName: 'Estado', 
      width: 120,
      renderCell: (params) => {
        const statusColors: Record<string, string> = {
          'pending': '#f59e0b',
          'confirmed': '#10b981',
          'cancelled': '#ef4444',
          'completed': '#6366f1'
        };
        return (
          <span style={{ 
            color: statusColors[params.value] || '#6b7280',
            fontWeight: 600 
          }}>
            {params.value === 'pending' ? 'Pendiente' :
             params.value === 'confirmed' ? 'Confirmada' :
             params.value === 'cancelled' ? 'Cancelada' :
             params.value === 'completed' ? 'Completada' : params.value}
          </span>
        );
      }
    }
  ];

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        //Descomentar cuando el backend esté listo
        /*
        let endpoint = '';
        
        // Switch case según el rol del usuario
        switch (user.role) {
          case 'artist':
            // Actividades del artista específico
            endpoint = `/api/activities?artistId=${user.profileData?.artistId || user.id}`;
            break;

          case 'manager':
            // Todas las actividades de todos los artistas de la agencia del manager
            endpoint = `/api/activities?agencyId=${user.agencyId}`;
            break;

          case 'director':
            // Todas las actividades de todos los artistas de la agencia del director
            endpoint = `/api/activities?agencyId=${user.agencyId}`;
            break;

          case 'admin':
            // Todas las actividades del sistema
            endpoint = '/api/activities';
            break;

          default:
            console.error('Rol no reconocido:', user.role);
            return;
        }
        const response = await fetch(`http://localhost:3000${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener actividades');
        }

        const data = await response.json();
        setActivities(data);
        */

        // DATOS DE PRUEBA 
        const mockActivities: Activity[] = [
          {
            id: 1,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Lee Min-ho',
            groupName: 'Phoenix',
            title: 'Concierto Seoul Music Festival',
            type: 'concert',
            date: '2025-12-05',
            time: '19:00',
            location: 'Olympic Stadium, Seoul',
            status: 'confirmed',
            description: 'Presentación principal en el festival de música'
          },
          {
            id: 2,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Kim Ji-soo',
            groupName: 'Starlight',
            title: 'Ensayo General',
            type: 'rehearsal',
            date: '2025-12-02',
            time: '14:00',
            location: 'Estudio A - K-Pop Stars Agency',
            status: 'confirmed',
            description: 'Ensayo para próximo showcase'
          },
          {
            id: 3,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Lee Min-ho',
            groupName: 'Phoenix',
            title: 'Grabación Nuevo Single',
            type: 'recording',
            date: '2025-12-08',
            time: '10:00',
            location: 'Big Hit Studio',
            status: 'pending',
            description: 'Sesión de grabación para el comeback'
          },
          {
            id: 4,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Park Soo-young',
            groupName: 'Dreamers',
            title: 'Evento Promocional',
            type: 'promotion',
            date: '2025-12-10',
            time: '16:00',
            location: 'Centro Comercial COEX',
            status: 'confirmed',
            description: 'Firma de autógrafos y meet & greet'
          },
          {
            id: 5,
            artistName: user.role === 'artist' ? user.name || 'Lee Min-ho' : 'Kim Ji-soo',
            groupName: 'Starlight',
            title: 'Reunión con Management',
            type: 'meeting',
            date: '2025-12-03',
            time: '11:00',
            location: 'Oficina K-Pop Stars Agency',
            status: 'pending',
            description: 'Planificación de actividades Q1 2026'
          }
        ];

        // Filtrar según rol
        let filteredActivities = mockActivities;
        if (user.role === 'artist') {
          filteredActivities = mockActivities.filter(a => a.id <= 3);
        } else if (user.role === 'manager' || user.role === 'director') {
          filteredActivities = mockActivities.filter(a => 
            ['Lee Min-ho', 'Kim Ji-soo'].includes(a.artistName)
          );
        }

        setActivities(filteredActivities);

      } catch (error) {
        console.error('Error al cargar actividades:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  const handleDelete = async (id: number) => {
    console.log('Eliminar actividad:', id);
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  const handleEditSave = async (updatedRow: Activity) => {
    console.log('Actualizar actividad:', updatedRow);
    setActivities(prev => 
      prev.map(activity => activity.id === updatedRow.id ? updatedRow : activity)
    );
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

    console.log('Aceptar actividad:', selectedActivity.id);
    
    // TODO: Llamada al backend
    /*
    await fetch(`http://localhost:3000/api/activities/${selectedActivity.id}/validate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ validated: true })
    });
    */

    // Actualizar estado local
    setActivities(prev =>
      prev.map(a => a.id === selectedActivity.id ? { ...a, status: 'confirmed' } : a)
    );
    setSelectedActivity({ ...selectedActivity, status: 'confirmed' });
  };

  const handleRejectActivity = async () => {
    if (!selectedActivity) return;

    console.log('Rechazar actividad:', selectedActivity.id);
    
    // TODO: Llamada al backend
    /*
    await fetch(`http://localhost:3000/api/activities/${selectedActivity.id}/validate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ validated: false })
    });
    */

    // Actualizar estado local
    setActivities(prev =>
      prev.map(a => a.id === selectedActivity.id ? { ...a, status: 'cancelled' } : a)
    );
    setSelectedActivity({ ...selectedActivity, status: 'cancelled' });
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
    subtitle: `${activity.time} - ${activity.artistName}`,
    color: activity.type,
    time: activity.time,
    type: activity.type
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
                  events={calendarEvents}
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
                    events={calendarEvents}
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
                <h3>Lista de Actividades</h3>
                <DataTable
                  columns={columns}
                  rows={activities}
                  pagesize={10}
                  onDelete={handleDelete}
                  onEditSave={handleEditSave}
                  showEditButton={true}
                />
              </div>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default Activities;
