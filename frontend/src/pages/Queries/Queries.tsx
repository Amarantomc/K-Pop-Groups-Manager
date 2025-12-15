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

    // Estados para Query 1: Actividades por grupo
  const [activities, setActivities] = useState<Activity[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');

  // Estados para Query 2: Información de artista
  const [artistInfo, setArtistInfo] = useState<Artist[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState('');
  


  // Estados para Query 4: Artistas con debut y contrato activo
  const [debutContractResults, setDebutContractResults] = useState<any[]>([]);

  // Estados para Query 4: Ingresos por artista
  const [incomeStart, setIncomeStart] = useState('');
  const [incomeEnd, setIncomeEnd] = useState('');
  const [incomeResults, setIncomeResults] = useState<any[]>([]);
  const [artistList, setArtistList] = useState<any[]>([]);
  const [apprenticeList, setApprenticeList] = useState<any[]>([]);
  const [artistApprenticeJoin, setArtistApprenticeJoin] = useState<any[]>([]);
  const [selectedArtistId, setSelectedArtistId] = useState('');
  // Obtener lista de artistas y aprendices, y hacer join por id de aprendiz
  useEffect(() => {
    const fetchArtistsAndApprentices = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        // Obtener artistas
        const resArtists = await fetch('http://localhost:3000/api/artist', { headers });
        const dataArtists = await resArtists.json();
        setArtistList(dataArtists.data || []);
        // Obtener aprendices
        const resApprentices = await fetch('http://localhost:3000/api/apprentice', { headers });
        const dataApprentices = await resApprentices.json();
        setApprenticeList(dataApprentices.data || []);
        // Hacer join por id de aprendiz
        const join = (dataArtists.data || []).map((artist: any) => {
          const apprentice = (dataApprentices.data || []).find((a: any) => a.id === artist.apprenticeId || a.id === artist.ApprenticeId);
          if (apprentice) {
            return {
              apprenticeId: artist.apprenticeId || artist.ApprenticeId,
              groupId: artist.groupId || artist.GroupId,
              realName: apprentice.name || apprentice.Name,
              artistName: artist.artistName || artist.ArtistName
            };
          }
          return null;
        }).filter(Boolean);
        console.log('Artistas:', dataArtists.data);
        console.log('Aprendices:', dataApprentices.data);
        console.log('Join:', join);
        setArtistApprenticeJoin(join);
      } catch (e) {
        console.log('Error en fetchArtistsAndApprentices:', e);
      }
    };
    fetchArtistsAndApprentices();
  }, []);

  // Estados para Query 6: Artistas con cambios de agencia y grupos
  const [agencyChangeResults, setAgencyChangeResults] = useState<any[]>([]);

  // Estados para Query 7: Historial de solistas de grupos disueltos con álbum exitoso
  const [soloistResults, setSoloistResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch dinámico de grupos y agencias al montar
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/group');
        const data = await res.json();
        setGroups(data.data || []);
      } catch {}
    };
    const fetchAgencies = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch('http://localhost:3000/api/agency', { headers });
        const data = await res.json();
        setAgencies(data.data || []);
      } catch {}
    };
    fetchGroups();
    fetchAgencies();
  }, []);

  // Consulta actividades por grupo usando el ID seleccionado
  const fetchActivitiesByGroup = async () => {
    if (!selectedGroupId) {
      setErrorMessage('Debe seleccionar un grupo');
      setOpenError(true);
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`http://localhost:3000/api/activity/byGroup/${selectedGroupId}`, { headers });
      const data = await response.json();
      setActivities(data.data || []);
    } catch (error) {
      setErrorMessage('Error al consultar actividades'); setOpenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Consulta artistas por agencia usando el ID seleccionado
  const fetchArtistsByAgency = async () => {
    if (!selectedAgencyId) {
      setErrorMessage('Debe seleccionar una agencia');
      setOpenError(true);
      return;
    }
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const response = await fetch(`http://localhost:3000/api/artist/${selectedAgencyId}`, { headers });
      console.log(selectedAgencyId)
      const data = await response.json();
      console.log(data)
      setArtistInfo(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setErrorMessage('Error al consultar artistas'); setOpenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQueryChange = (queryNumber: number) => {
    setSelectedQuery(queryNumber);
    // Limpiar resultados anteriores
    setActivities([]);
    setArtistInfo([]); // Limpiar artistas mostrados al cambiar consulta
    // setConflictResults([]); // Eliminado: ya no hay query 3
    setDebutContractResults([]);
    setIncomeResults([]);
    setAgencyChangeResults([]);
    setSoloistResults([]);
    setSelectedAgencyId(''); // Limpiar agencia seleccionada
  };

  return (
    <PageLayout
      title="Consultas"
      description="Consultas especializadas del sistema"
    >
      <div className="queries-container">
        <div className="query-selector">
          <button className={`query-btn ${selectedQuery === 1 ? 'active' : ''}`} style={{ width: '320px' }} onClick={() => handleQueryChange(1)}>
            1. Artistas activos por agencia
          </button>
          <button className={`query-btn ${selectedQuery === 2 ? 'active' : ''}`} style={{ width: '320px' }} onClick={() => handleQueryChange(2)}>
            2. Actividades por grupo
          </button>
          <button className={`query-btn ${selectedQuery === 3 ? 'active' : ''}`} style={{ width: '320px' }} onClick={() => handleQueryChange(3)}>
            3. Artistas con debut y contrato activo
          </button>
          <button className={`query-btn ${selectedQuery === 4 ? 'active' : ''}`} style={{ width: '320px' }} onClick={() => handleQueryChange(4)}>
            4. Ingresos por artista
          </button>
          <button className={`query-btn ${selectedQuery === 5 ? 'active' : ''}`} style={{ width: '320px' }} onClick={() => handleQueryChange(5)}>
            5. Cambios de agencia y grupos
          </button>
          <button className={`query-btn ${selectedQuery === 6 ? 'active' : ''}`} style={{ width: '320px' }} onClick={() => handleQueryChange(6)}>
            6. Solistas de grupos disueltos con álbum exitoso
          </button>
        </div>

        
        {/* Contenido de Query 1: Artistas activos por agencia */}
        {selectedQuery === 1 && (
          <div className="query-content">
            <h3>Artistas activos por agencia</h3>
            <p className="query-description">Consulta los artistas activos de una agencia específica.</p>
            <div className="query-form">
              {user?.role === 'manager' && (
                <>
                  <label>Agencia:</label>
                  <select value={selectedAgencyId} onChange={e => {
                    console.log(e.target);
                    setSelectedAgencyId(e.target.value);
                    setArtistInfo([]);
                  }}>
                    <option value="">Selecciona una agencia</option>
                    {agencies.map((a: any) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <button className="btn-primary" disabled={isLoading || !selectedAgencyId} onClick={async () => {
                    if (!selectedAgencyId) return;
                    fetchArtistsByAgency();
                  }}>
                    Consultar
                  </button>
                </>
              )}
            </div>
            {artistInfo.length > 0 && (
              <div className="query-results">
                <h4>Artistas activos de la agencia seleccionada</h4>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Grupo</th>
                        <th>Debut</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {artistInfo.filter((artist: any) => artist.Status === 'Activo').map((artist: any) => (
                        <tr key={artist.ApprenticeId || artist.id}>
                          <td>{artist.ApprenticeId || artist.id}</td>
                          <td>{artist.ArtistName}</td>
                          <td>{artist.groupHistory?.map((g: { id: number; name: string; debut: string; status: string; memberCount: number; IdAgency: number }) => g.name).join(', ')}</td>
                          <td>{artist.DebutDate}</td>
                          <td>{artist.Status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {artistInfo.filter((artist: any) => artist.Status === 'Activo').length === 0 && !isLoading && selectedAgencyId && (
              <div className="no-results">No se encontraron artistas activos para la agencia seleccionada</div>
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
              <select id="groupId" value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)}>
                <option value="">-- Seleccione un grupo --</option>
                {groups.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
              <button className="btn-primary" onClick={fetchActivitiesByGroup} disabled={isLoading || !selectedGroupId}>
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
            {activities.length === 0 && !isLoading && selectedGroupId && (
              <div className="no-results">No se encontraron actividades para el grupo seleccionado</div>
            )}
          </div>
        )}

        {/* Contenido de Query 3: Artistas con debut y contrato activo */}
        {selectedQuery === 3 && (
          <div className="query-content">
            <h3>Artistas con Debut y Contrato Activo</h3>
            <p className="query-description">
              Identifica artistas que han participado en al menos un debut y tienen contratos activos, mostrando datos del grupo y contrato.
            </p>
            <div className="query-form">
              <label>Agencia:</label>
              <select value={selectedAgencyId} onChange={e => {
                setSelectedAgencyId(e.target.value);
                setDebutContractResults([]);
              }}>
                <option value="">Selecciona una agencia</option>
                {agencies.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <button className="btn-primary" disabled={isLoading || !selectedAgencyId} onClick={async () => {
                if (!selectedAgencyId) {
                  setErrorMessage('Debe seleccionar una agencia'); setOpenError(true); return;
                }
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  const response = await fetch(`http://localhost:3000/api/artist/query/${selectedAgencyId}`, { headers });
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
                        <th>Debut Grupo</th>
                        <th>Contrato (inicio)</th>
                        <th>Status Contrato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debutContractResults.map((row, i) => (
                        <tr key={i}>
                          <td>{row.artistName}</td>
                          <td>{row.group?.name}</td>
                          <td>{row.group?.debutDate ? new Date(row.group.debutDate).toLocaleDateString() : ''}</td>
                          <td>{row.contract?.startDate ? new Date(row.contract.startDate).toLocaleDateString() : ''}</td>
                          <td>{row.contract?.status}</td>
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

        {/* Contenido de Query 4: Ingresos por artista */}
        {selectedQuery === 4 && (
          <div className="query-content">
            <h3>Ingresos y Éxitos por Artista</h3>
            <p className="query-description">
              Calcula el total de ingresos generados por cada artista, considerando ingresos grupales e individuales en un periodo, mostrando éxitos principales y último grupo.
            </p>
            <div className="query-form">
              <label>Artista:</label>
              <select value={selectedArtistId} onChange={e => {
                setSelectedArtistId(e.target.value);
                setIncomeResults([]);
              }}>
                <option value="">Selecciona un artista</option>
                {artistApprenticeJoin.map((a: any) => (
                  <option key={a.apprenticeId} value={a.apprenticeId}>
                    {a.realName}
                  </option>
                ))}
              </select>
              <label>Fecha Inicio:</label>
              <input type="date" value={incomeStart} onChange={e => setIncomeStart(e.target.value)} />
              <label>Fecha Fin:</label>
              <input type="date" value={incomeEnd} onChange={e => setIncomeEnd(e.target.value)} />
              <button className="btn-primary" disabled={isLoading || !incomeStart || !incomeEnd || !selectedArtistId} onClick={async () => {
                if (!incomeStart || !incomeEnd || !selectedArtistId) {
                  setErrorMessage('Debe ingresar todos los campos'); setOpenError(true); return;
                }
                setIsLoading(true);
                try {
                  const token = localStorage.getItem('token');
                  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
                  if (token) headers['Authorization'] = `Bearer ${token}`;
                  // Buscar el artista seleccionado para obtener su groupId
                  const selectedArtist = artistApprenticeJoin.find((a: any) => String(a.apprenticeId) === selectedArtistId);
                  console.log('Artista seleccionado:', selectedArtist);
                  const apprenticeId = selectedArtist?.apprenticeId;
                  const groupId = selectedArtist?.groupId;
                  const response = await fetch(`http://localhost:3000/api/artist/succes`, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                      apprenticeId: Number(apprenticeId),
                      groupId: Number(groupId),
                      startDate: incomeStart,
                      endDate: incomeEnd
                    })
                  });
                  const data = await response.json();
                  console.log('Respuesta de ingresos:', data);
                  setIncomeResults(data.data ? [data.data] : []);
                } catch (error) { 
                  setErrorMessage('Error al consultar ingresos'); setOpenError(true); 
                  console.log('Error en consulta de ingresos:', error);
                }
                finally { setIsLoading(false); }
              }}>
                {isLoading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>
            {incomeResults.length > 0 && (
              <div className="query-results">
                <h4>Ingresos y Éxitos</h4>
                <div className="results-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Ingresos Totales</th>
                        <th>Éxitos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incomeResults.map((row, i) => (
                        <tr key={i}>
                          <td>{row.incomes?.TotalIncome ?? row.incomes?.totalIncome ?? row.incomes?.totalincome}</td>
                          <td>
                            {Array.isArray(row.succes) && row.succes.length > 0 ? (
                              row.succes.map((s: any, idx: number) => (
                                <div key={idx}>
                                  {s.Title || s.title} {s.releaseDate || s.releasedate ? `(${new Date(s.releaseDate || s.releasedate).toLocaleDateString()})` : ''}
                                </div>
                              ))
                            ) : (
                              <span>No hay éxitos</span>
                            )}
                          </td>
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

        {/* Contenido de Query 5: Cambios de agencia y grupos */}
        {selectedQuery === 5 && (
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
                  // Endpoint según imagen: /artist/agencyChanges/
                  const response = await fetch('http://localhost:3000/api/artist/agencyChanges', { headers });
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
                          <td>{row.artistName || row.name}</td>
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

        {/* Contenido de Query 6: Solistas de grupos disueltos con álbum exitoso */}
        {selectedQuery === 6 && (
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
                  const response = await fetch('http://localhost:3000/api/artist/soloArtists', { headers });
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

      </div>

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
    </PageLayout>
  );
};

export default Queries;
