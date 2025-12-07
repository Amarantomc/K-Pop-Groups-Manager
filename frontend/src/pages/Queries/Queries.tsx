/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import PageLayout from '../../components/pageLayout/PageLayout';
import { useAuth } from '../../contexts/auth/AuthContext';
import ConfirmDialog from '../../components/confirmDialog/ConfirmDialog';
import './Queries.css';

interface Activity {
  id: number;
  responsible: string;
  activityType: string;
  date: string;
  place: string;
  eventType: string;
}

interface Artist {
  ApprenticeId: number;
  GroupId: number;
  ArtistName: string;
  DebutDate: string;
  Status: string;
  groupHistory: Array<{
    id: number;
    name: string;
    debut: string;
    status: string;
    memberCount: number;
    IdAgency: number;
  }>;
}

const Queries: React.FC = () => {
  const { user } = useAuth();
  const [selectedQuery, setSelectedQuery] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Estados para Query 1: Actividades por grupo
  const [groupId, setGroupId] = useState<string>('');
  const [activities, setActivities] = useState<Activity[]>([]);

  // Estados para Query 2: Información de artista
  const [artistId, setArtistId] = useState<string>('');
  const [artistInfo, setArtistInfo] = useState<Artist | null>(null);

  const fetchActivitiesByGroup = async () => {
    if (!groupId.trim()) {
      setErrorMessage('Debe ingresar un ID de grupo');
      setOpenError(true);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:3000/api/activity/byGroup/${groupId}`, {
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg = errorData?.error || errorData?.message || 'Error al obtener las actividades';
        setErrorMessage(errorMsg);
        setOpenError(true);
        return;
      }

      const data = await response.json();
      console.log('Actividades obtenidas:', data);
      
      if (data.success && data.data) {
        setActivities(data.data);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error de red');
      setOpenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArtistInfo = async () => {
    if (!artistId.trim()) {
      setErrorMessage('Debe ingresar un ID de artista');
      setOpenError(true);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:3000/api/artist/${artistId}`, {
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMsg = errorData?.error || errorData?.message || 'Error al obtener información del artista';
        setErrorMessage(errorMsg);
        setOpenError(true);
        return;
      }

      const data = await response.json();
      console.log('Artista obtenido:', data);
      
      if (data.success && data.data) {
        setArtistInfo(data.data);
      } else {
        setArtistInfo(null);
      }
    } catch (error) {
      console.error('Error al obtener artista:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error de red');
      setOpenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (queryNumber: number) => {
    setSelectedQuery(queryNumber);
    // Limpiar resultados anteriores
    setActivities([]);
    setArtistInfo(null);
    setGroupId('');
    setArtistId('');
  };

  return (
    <PageLayout
      title="Consultas"
      description="Consultas especializadas del sistema"
    >
      <div className="queries-container">
        {/* Selector de consulta */}
        <div className="query-selector">
          <button
            className={`query-btn ${selectedQuery === 1 ? 'active' : ''}`}
            onClick={() => handleQueryChange(1)}
          >
            1. Actividades por Grupo
          </button>
          <button
            className={`query-btn ${selectedQuery === 2 ? 'active' : ''}`}
            onClick={() => handleQueryChange(2)}
          >
            2. Información de Artista
          </button>
        </div>

        {/* Contenido de Query 1: Actividades por grupo */}
        {selectedQuery === 1 && (
          <div className="query-content">
            <h3>Consultar Calendario de Actividades por Grupo</h3>
            <p className="query-description">
              Obtiene el calendario completo de actividades programadas para un grupo específico,
              incluyendo detalles de lugar, hora y tipo de actividad.
            </p>

            <div className="query-form">
              <label htmlFor="groupId">ID del Grupo:</label>
              <input
                type="number"
                id="groupId"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="Ingrese el ID del grupo"
              />
              <button
                className="btn-primary"
                onClick={fetchActivitiesByGroup}
                disabled={isLoading}
              >
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>

            {/* Resultados */}
            {activities.length > 0 && (
              <div className="query-results">
                <h4>Actividades del Grupo {groupId}</h4>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Responsable</th>
                        <th>Tipo de Actividad</th>
                        <th>Fecha</th>
                        <th>Lugar</th>
                        <th>Tipo de Evento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => (
                        <tr key={activity.id}>
                          <td>{activity.id}</td>
                          <td>{activity.responsible}</td>
                          <td>{activity.activityType}</td>
                          <td>{new Date(activity.date).toLocaleDateString()}</td>
                          <td>{activity.place}</td>
                          <td>{activity.eventType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activities.length === 0 && !isLoading && groupId && (
              <div className="no-results">
                No se encontraron actividades para el grupo {groupId}
              </div>
            )}
          </div>
        )}

        {/* Contenido de Query 2: Información de artista */}
        {selectedQuery === 2 && (
          <div className="query-content">
            <h3>Información Completa de Artista</h3>
            <p className="query-description">
              Obtiene el historial profesional completo de un artista, incluyendo todos los grupos
              en los que ha participado y su información actual.
            </p>

            <div className="query-form">
              <label htmlFor="artistId">ID del Artista:</label>
              <input
                type="number"
                id="artistId"
                value={artistId}
                onChange={(e) => setArtistId(e.target.value)}
                placeholder="Ingrese el ID del artista"
              />
              <button
                className="btn-primary"
                onClick={fetchArtistInfo}
                disabled={isLoading}
              >
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>

            {/* Resultados */}
            {artistInfo && (
              <div className="query-results">
                <h4>Información del Artista</h4>
                
                <div className="artist-info-card">
                  <div className="info-section">
                    <h5>Datos Generales</h5>
                    <p><strong>Nombre:</strong> {artistInfo.ArtistName}</p>
                    <p><strong>ID Aprendiz:</strong> {artistInfo.ApprenticeId}</p>
                    <p><strong>ID Grupo Actual:</strong> {artistInfo.GroupId}</p>
                    <p><strong>Fecha de Debut:</strong> {new Date(artistInfo.DebutDate).toLocaleDateString()}</p>
                    <p><strong>Estado:</strong> <span className={`status-badge ${artistInfo.Status.toLowerCase()}`}>{artistInfo.Status}</span></p>
                  </div>

                  {artistInfo.groupHistory && artistInfo.groupHistory.length > 0 && (
                    <div className="info-section">
                      <h5>Historial de Grupos</h5>
                      <div className="group-history">
                        {artistInfo.groupHistory.map((group) => (
                          <div key={group.id} className="group-card">
                            <h6>{group.name}</h6>
                            <p><strong>Debut:</strong> {new Date(group.debut).toLocaleDateString()}</p>
                            <p><strong>Estado:</strong> {group.status}</p>
                            <p><strong>Miembros:</strong> {group.memberCount}</p>
                            <p><strong>ID Agencia:</strong> {group.IdAgency}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!artistInfo && !isLoading && artistId && (
              <div className="no-results">
                No se encontró información para el artista {artistId}
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        title="Error"
        message={errorMessage}
        open={openError}
        onCancel={() => setOpenError(false)}
        onConfirm={() => setOpenError(false)}
        confirmText="Aceptar"
        showDeleteButton={false}
      />
    </PageLayout>
  );
};

export default Queries;
