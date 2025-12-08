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

  // Estados para Query 3: Conflictos de agenda
  const [conflictStart, setConflictStart] = useState('');
  const [conflictEnd, setConflictEnd] = useState('');
  const [conflictResults, setConflictResults] = useState<any[]>([]);

  // Estados para Query 4: Artistas con debut y contrato activo
  const [debutContractResults, setDebutContractResults] = useState<any[]>([]);

  // Estados para Query 5: Ingresos por artista
  const [incomeStart, setIncomeStart] = useState('');
  const [incomeEnd, setIncomeEnd] = useState('');
  const [incomeResults, setIncomeResults] = useState<any[]>([]);

  // Estados para Query 6: Artistas con cambios de agencia y grupos
  const [agencyChangeResults, setAgencyChangeResults] = useState<any[]>([]);

  // Estados para Query 7: Historial de solistas de grupos disueltos con álbum exitoso
  const [soloistResults, setSoloistResults] = useState<any[]>([]);
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
    setConflictResults([]);
    setDebutContractResults([]);
    setIncomeResults([]);
    setAgencyChangeResults([]);
    setSoloistResults([]);
  };

  return (
    <PageLayout
      title="Consultas"
      description="Consultas especializadas del sistema"
    >
      <div className="queries-container">
        {/* Selector de consulta */}
        <div className="query-selector">
          <button className={`query-btn ${selectedQuery === 1 ? 'active' : ''}`} onClick={() => handleQueryChange(1)}>
            1. Artistas activos por agencia
          </button>
          <button className={`query-btn ${selectedQuery === 2 ? 'active' : ''}`} onClick={() => handleQueryChange(2)}>
            2. Calendario de actividades por grupo
          </button>
          <button className={`query-btn ${selectedQuery === 3 ? 'active' : ''}`} onClick={() => handleQueryChange(3)}>
            3. Conflictos de agenda
          </button>
          <button className={`query-btn ${selectedQuery === 4 ? 'active' : ''}`} onClick={() => handleQueryChange(4)}>
            4. Artistas con debut y contrato activo
          </button>
          <button className={`query-btn ${selectedQuery === 5 ? 'active' : ''}`} onClick={() => handleQueryChange(5)}>
            5. Ingresos por artista
          </button>
          <button className={`query-btn ${selectedQuery === 6 ? 'active' : ''}`} onClick={() => handleQueryChange(6)}>
            6. Cambios de agencia y grupos
          </button>
          <button className={`query-btn ${selectedQuery === 7 ? 'active' : ''}`} onClick={() => handleQueryChange(7)}>
            7. Solistas de grupos disueltos con álbum exitoso
          </button>
        </div>
        {/* Contenido de Query 3: Conflictos de agenda */}
        {selectedQuery === 3 && (
          <div className="query-content">
            <h3>Conflictos de Agenda</h3>
            <p className="query-description">
              Verifica qué artistas tienen conflictos de agenda en un periodo, cruzando actividades grupales e individuales.
            </p>
            <div className="query-form">
              <label>Fecha Inicio:</label>
              <input type="date" value={conflictStart} onChange={e => setConflictStart(e.target.value)} />
              <label>Fecha Fin:</label>
              <input type="date" value={conflictEnd} onChange={e => setConflictEnd(e.target.value)} />
              <button className="btn-primary" disabled={isLoading} onClick={async () => {
                if (!conflictStart || !conflictEnd) {
                  setErrorMessage('Debe ingresar ambas fechas'); setOpenError(true); return;
                }
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  const response = await fetch(`http://localhost:3000/api/activity/conflicts?start=${conflictStart}&end=${conflictEnd}`, { headers });
                  const data = await response.json();
                  setConflictResults(data.data || []);
                } catch (error) { setErrorMessage('Error al consultar conflictos'); setOpenError(true); }
                finally { setIsLoading(false); }
              }}>
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
            {conflictResults.length > 0 && (
              <div className="query-results">
                <h4>Artistas con Conflictos de Agenda</h4>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Artista</th>
                        <th>Actividades en Conflicto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conflictResults.map((row, i) => (
                        <tr key={i}>
                          <td>{row.artistName}</td>
                          <td>{row.conflictingActivities?.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {conflictResults.length === 0 && !isLoading && conflictStart && conflictEnd && (
              <div className="no-results">No se encontraron conflictos de agenda en el periodo seleccionado.</div>
            )}
          </div>
        )}

        {/* Contenido de Query 4: Artistas con debut y contrato activo */}
        {selectedQuery === 4 && (
          <div className="query-content">
            <h3>Artistas con Debut y Contrato Activo</h3>
            <p className="query-description">
              Identifica artistas que han participado en al menos un debut y tienen contratos activos, mostrando datos del grupo y contrato.
            </p>
            <div className="query-form">
              <button className="btn-primary" disabled={isLoading} onClick={async () => {
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  const response = await fetch('http://localhost:3000/api/artist/debut-contract', { headers });
                  const data = await response.json();
                  setDebutContractResults(data.data || []);
                } catch (error) { setErrorMessage('Error al consultar artistas'); setOpenError(true); }
                finally { setIsLoading(false); }
              }}>
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
            {debutContractResults.length > 0 && (
              <div className="query-results">
                <h4>Artistas con Debut y Contrato Activo</h4>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Artista</th>
                        <th>Grupo</th>
                        <th>Contrato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debutContractResults.map((row, i) => (
                        <tr key={i}>
                          <td>{row.artistName}</td>
                          <td>{row.groupName}</td>
                          <td>{row.contractInfo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {debutContractResults.length === 0 && !isLoading && (
              <div className="no-results">No se encontraron artistas con debut y contrato activo.</div>
            )}
          </div>
        )}

        {/* Contenido de Query 5: Ingresos por artista */}
        {selectedQuery === 5 && (
          <div className="query-content">
            <h3>Ingresos por Artista</h3>
            <p className="query-description">
              Calcula el total de ingresos generados por cada artista, considerando ingresos grupales e individuales en un periodo, mostrando éxitos principales y último grupo.
            </p>
            <div className="query-form">
              <label>Fecha Inicio:</label>
              <input type="date" value={incomeStart} onChange={e => setIncomeStart(e.target.value)} />
              <label>Fecha Fin:</label>
              <input type="date" value={incomeEnd} onChange={e => setIncomeEnd(e.target.value)} />
              <button className="btn-primary" disabled={isLoading} onClick={async () => {
                if (!incomeStart || !incomeEnd) {
                  setErrorMessage('Debe ingresar ambas fechas'); setOpenError(true); return;
                }
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  const response = await fetch(`http://localhost:3000/api/artist/income?start=${incomeStart}&end=${incomeEnd}`, { headers });
                  const data = await response.json();
                  setIncomeResults(data.data || []);
                } catch (error) { setErrorMessage('Error al consultar ingresos'); setOpenError(true); }
                finally { setIsLoading(false); }
              }}>
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
            {incomeResults.length > 0 && (
              <div className="query-results">
                <h4>Ingresos por Artista</h4>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Artista</th>
                        <th>Ingresos Totales</th>
                        <th>Éxitos Solista</th>
                        <th>Último Grupo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeResults.map((row, i) => (
                        <tr key={i}>
                          <td>{row.artistName}</td>
                          <td>{row.totalIncome}</td>
                          <td>{row.topHits?.join(', ')}</td>
                          <td>{row.lastGroup}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {incomeResults.length === 0 && !isLoading && incomeStart && incomeEnd && (
              <div className="no-results">No se encontraron ingresos para el periodo seleccionado.</div>
            )}
          </div>
        )}

        {/* Contenido de Query 6: Cambios de agencia y grupos */}
        {selectedQuery === 6 && (
          <div className="query-content">
            <h3>Cambios de Agencia y Grupos</h3>
            <p className="query-description">
              Detecta artistas que han cambiado de agencia al menos dos veces y han participado en más de un grupo, mostrando historial cronológico de contratos, actividades y debuts.
            </p>
            <div className="query-form">
              <button className="btn-primary" disabled={isLoading} onClick={async () => {
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  const response = await fetch('http://localhost:3000/api/artist/agency-changes', { headers });
                  const data = await response.json();
                  setAgencyChangeResults(data.data || []);
                } catch (error) { setErrorMessage('Error al consultar artistas'); setOpenError(true); }
                finally { setIsLoading(false); }
              }}>
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
            {agencyChangeResults.length > 0 && (
              <div className="query-results">
                <h4>Artistas con Cambios de Agencia y Grupos</h4>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Artista</th>
                        <th>Historial</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agencyChangeResults.map((row, i) => (
                        <tr key={i}>
                          <td>{row.artistName}</td>
                          <td>
                            {row.history && Array.isArray(row.history) ? (
                              <ul>{row.history.map((h: any, idx: number) => <li key={idx}>{h}</li>)}</ul>
                            ) : row.history}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {agencyChangeResults.length === 0 && !isLoading && (
              <div className="no-results">No se encontraron artistas con los criterios especificados.</div>
            )}
          </div>
        )}

        {/* Contenido de Query 7: Solistas de grupos disueltos con álbum exitoso */}
        {selectedQuery === 7 && (
          <div className="query-content">
            <h3>Solistas de Grupos Disueltos con Álbum Exitoso</h3>
            <p className="query-description">
              Obtiene el historial profesional de solistas que hayan sido miembros de un grupo disuelto con álbum exitoso y canciones top 100 en Billboard.
            </p>
            <div className="query-form">
              <button className="btn-primary" disabled={isLoading} onClick={async () => {
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  const response = await fetch('http://localhost:3000/api/artist/soloist-history', { headers });
                  const data = await response.json();
                  setSoloistResults(data.data || []);
                } catch (error) { setErrorMessage('Error al consultar solistas'); setOpenError(true); }
                finally { setIsLoading(false); }
              }}>
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
            {soloistResults.length > 0 && (
              <div className="query-results">
                <h4>Solistas con Historial Destacado</h4>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Artista</th>
                        <th>Historial</th>
                      </tr>
                    </thead>
                    <tbody>
                      {soloistResults.map((row, i) => (
                        <tr key={i}>
                          <td>{row.artistName}</td>
                          <td>
                            {row.history && Array.isArray(row.history) ? (
                              <ul>{row.history.map((h: any, idx: number) => <li key={idx}>{h}</li>)}</ul>
                            ) : row.history}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {soloistResults.length === 0 && !isLoading && (
              <div className="no-results">No se encontraron solistas con los criterios especificados.</div>
            )}
          </div>
        )}

        {/* Contenido de Query 1: Artistas activos por agencia */}
        {selectedQuery === 1 && (
          <div className="query-content">
            <h3>Artistas activos por agencia</h3>
            <p className="query-description">
              Permite a los emphmanagers de cada agencia obtener un listado de todos los artistas activos asociados a su agencia, mostrando el nombre artístico, grupo al que pertenecen y estado actual.
            </p>
            <div className="query-form">
              <button className="btn-primary" onClick={async () => {
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  const response = await fetch('http://localhost:3000/api/artist/active-by-agency', { headers });
                  const data = await response.json();
                  setActivities(data.data || []);
                } catch (error) { setErrorMessage('Error al consultar artistas activos'); setOpenError(true); }
                finally { setIsLoading(false); }
              }} disabled={isLoading}>
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
            {activities.length > 0 && (
              <div className="query-results">
                <h4>Artistas activos de la agencia</h4>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre Artístico</th>
                        <th>Grupo</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((artist: any, i: number) => (
                        <tr key={i}>
                          <td>{artist.ArtistName || artist.artistName}</td>
                          <td>{artist.groupName}</td>
                          <td>{artist.Status || artist.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activities.length === 0 && !isLoading && (
              <div className="no-results">No se encontraron artistas activos para la agencia.</div>
            )}
          </div>
        )}

        {/* Contenido de Query 2: Calendario de actividades por grupo */}
        {selectedQuery === 2 && (
          <div className="query-content">
            <h3>Calendario de actividades por grupo</h3>
            <p className="query-description">
              Consulta el calendario completo de actividades programadas para un grupo en un rango de fechas, con detalles de lugar, hora y tipo de actividad.
            </p>
            <div className="query-form">
              <label htmlFor="groupId">Seleccione el grupo:</label>
              <select id="groupId" value={groupId} onChange={e => setGroupId(e.target.value)}>
                <option value="">-- Seleccione un grupo --</option>
                {/* Aquí deberías mapear los grupos desde la base de datos */}
                {/* Ejemplo: <option value="1">Phoenix</option> */}
              </select>
              <button className="btn-primary" onClick={fetchActivitiesByGroup} disabled={isLoading}>
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
            {activities.length > 0 && (
              <div className="query-results">
                <h4>Actividades del Grupo seleccionado</h4>
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
              <div className="no-results">No se encontraron actividades para el grupo seleccionado</div>
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        title="Aviso de Consulta"
        message={errorMessage}
        open={openError}
        onCancel={() => setOpenError(false)}
        onConfirm={() => setOpenError(false)}
        confirmText="Cerrar"
        showDeleteButton={false}
      />
    </PageLayout>
  );
};

export default Queries;
