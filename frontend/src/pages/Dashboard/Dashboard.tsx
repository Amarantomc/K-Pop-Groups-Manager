/* eslint-disable @typescript-eslint/no-explicit-any */ 
import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/pageLayout/PageLayout';
import StatCard from '../../components/statCard/StatCard';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import EventIcon from '@mui/icons-material/Event';
import AlbumIcon from '@mui/icons-material/Album';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PaletteIcon from '@mui/icons-material/Palette';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';
import "./Dashboard.css"

const Dashboard : React.FC = () =>{
  const [agenciesCount, setAgenciesCount] = useState<number | null>(null);
  const [apprenticesCount, setApprenticesCount] = useState<number | null>(null);
  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [artistsCount, setArtistsCount] = useState<number | null>(null);
  const [groupsCount, setGroupsCount] = useState<number | null>(null);
  const [albumsCount, setAlbumsCount] = useState<number | null>(null);
  const [activitiesCount, setActivitiesCount] = useState<number | null>(null);
  const [songsCount, setSongsCount] = useState<number | null>(null);
  const [awardsCount, setAwardsCount] = useState<number | null>(null);
  const [conceptsCount, setConceptsCount] = useState<number | null>(null);
  const [visualConceptsCount, setVisualConceptsCount] = useState<number | null>(null);
  const [popularityListsCount, setPopularityListsCount] = useState<number | null>(null);
  const [contractsCount, setContractsCount] = useState<number | null>(null);
  const [incomesCount, setIncomesCount] = useState<number | null>(null);
  const [requestsCount, setRequestsCount] = useState<number | null>(null);
  const [evaluationsCount, setEvaluationsCount] = useState<number | null>(null);

  useEffect(() => {
    const API_BASE = 'http://localhost:3000';

    const fetchCount = async (url: string) => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined;
        const res = await fetch(url, { headers });

        if (!res.ok) {
          if (import.meta.env.MODE === 'development') {
            const txt = await res.text().catch(() => '');
            // eslint-disable-next-line no-console
            console.debug('[Dashboard] fetchCount non-ok', url, res.status, res.statusText, txt);
          }
          return null;
        }

        const data = await res.json().catch(() => null);

        // Casos comunes que puede devolver el backend
        // - una lista (array)
        if (Array.isArray(data)) return data.length;

        // - objeto con clave 'data' que contiene lista
        if (data && typeof data === 'object') {
          if (Array.isArray((data as any).data)) return (data as any).data.length;
          if (typeof (data as any).total === 'number') return (data as any).total;
          if (typeof (data as any).count === 'number') return (data as any).count;
          if (typeof (data as any).length === 'number') return (data as any).length;
          // algunos endpoints devuelven { meta: { total: X } }
          if ((data as any).meta && typeof (data as any).meta.total === 'number') return (data as any).meta.total;
        }

        // Si no logramos inferir nada, devolver null
        if (import.meta.env.MODE === 'development') {
          // eslint-disable-next-line no-console
          console.debug('[Dashboard] fetchCount unknown response shape', url, data);
        }
        return null;
      } catch (e) {
        if (import.meta.env.MODE === 'development') console.debug('[Dashboard] fetchCount error', url, e);
        return null;
      }
    };

    (async () => {
      const [a, p, u, ar, g, al, ac, s, aw, c, vc, pl, co, i, r, e] = await Promise.all([
        fetchCount(`${API_BASE}/api/agency/`),
        fetchCount(`${API_BASE}/api/apprentice/`),
        fetchCount(`${API_BASE}/api/user`),
        fetchCount(`${API_BASE}/api/artist/`),
        fetchCount(`${API_BASE}/api/group/`),
        fetchCount(`${API_BASE}/api/albums/`),
        fetchCount(`${API_BASE}/api/activity/`),
        fetchCount(`${API_BASE}/api/songs/`),
        fetchCount(`${API_BASE}/api/awards/`),
        fetchCount(`${API_BASE}/api/concept/`),
        fetchCount(`${API_BASE}/api/visual-concept/`),
        fetchCount(`${API_BASE}/api/popularity-lists/`),
        fetchCount(`${API_BASE}/api/contracts/`),
        fetchCount(`${API_BASE}/api/income/`),
        fetchCount(`${API_BASE}/api/requests/`),
        fetchCount(`${API_BASE}/api/evaluations/`),
      ]);
      setAgenciesCount(a);
      setApprenticesCount(p);
      setUsersCount(u);
      setArtistsCount(ar);
      setGroupsCount(g);
      setAlbumsCount(al);
      setActivitiesCount(ac);
      setSongsCount(s);
      setAwardsCount(aw);
      setConceptsCount(c);
      setVisualConceptsCount(vc);
      setPopularityListsCount(pl);
      setContractsCount(co);
      setIncomesCount(i);
      setRequestsCount(r);
      setEvaluationsCount(e);
    })();
  }, []);

  const renderValue = (v: number | null) => v == null ? '—' : String(v);

  return (
    <PageLayout 
      title='Bienvenido a Gestión de Agencias del K-Pop' 
      description='Administra agencias, artistas y actividades desde este panel. Aquí tienes un resumen rápido para comenzar.'
      className='dashboard-page'
    >
      <div className='dashboard-stats-grid'>
        <StatCard
          title="Agencias"
          value={renderValue(agenciesCount)}
          icon={<BusinessIcon />}
          color="#3b82f6"
          subtitle="Agencias registradas"
          trend={agenciesCount !== null && agenciesCount > 5 ? { value: 12, direction: "up" } : undefined}
        />
        <StatCard
          title="Aprendices"
          value={renderValue(apprenticesCount)}
          icon={<PeopleIcon />}
          color="#10b981"
          subtitle="En entrenamiento"
          trend={apprenticesCount !== null && apprenticesCount > 0 ? { value: 8, direction: "up" } : undefined}
        />
        <StatCard
          title="Usuarios"
          value={renderValue(usersCount)}
          icon={<PersonIcon />}
          color="#f59e0b"
          subtitle="Usuarios del sistema"
        />
        <StatCard
          title="Artistas"
          value={renderValue(artistsCount)}
          icon={<MusicNoteIcon />}
          color="#ec4899"
          subtitle="Artistas activos"
          trend={artistsCount !== null && artistsCount > 10 ? { value: 15, direction: "up" } : undefined}
        />
        <StatCard
          title="Grupos"
          value={renderValue(groupsCount)}
          icon={<GroupsIcon />}
          color="#8b5cf6"
          subtitle="Grupos formados"
        />
        <StatCard
          title="Álbumes"
          value={renderValue(albumsCount)}
          icon={<AlbumIcon />}
          color="#06b6d4"
          subtitle="Lanzamientos totales"
        />
        <StatCard
          title="Actividades"
          value={renderValue(activitiesCount)}
          icon={<EventIcon />}
          color="#14b8a6"
          subtitle="Eventos programados"
        />
        <StatCard
          title="Canciones"
          value={renderValue(songsCount)}
          icon={<LibraryMusicIcon />}
          color="#0ea5e9"
          subtitle="Tracks en catálogo"
        />
        <StatCard
          title="Premios"
          value={renderValue(awardsCount)}
          icon={<EmojiEventsIcon />}
          color="#eab308"
          subtitle="Galardones obtenidos"
        />
        <StatCard
          title="Conceptos"
          value={renderValue(conceptsCount)}
          icon={<LightbulbIcon />}
          color="#f97316"
          subtitle="Ideas creativas"
        />
        <StatCard
          title="Conceptos Visuales"
          value={renderValue(visualConceptsCount)}
          icon={<PaletteIcon />}
          color="#d946ef"
          subtitle="Diseños visuales"
        />
        <StatCard
          title="Listas de Popularidad"
          value={renderValue(popularityListsCount)}
          icon={<TrendingUpIcon />}
          color="#22c55e"
          subtitle="Rankings activos"
        />
        <StatCard
          title="Contratos"
          value={renderValue(contractsCount)}
          icon={<DescriptionIcon />}
          color="#64748b"
          subtitle="Acuerdos vigentes"
        />
        <StatCard
          title="Ingresos"
          value={renderValue(incomesCount)}
          icon={<AttachMoneyIcon />}
          color="#16a34a"
          subtitle="Registros financieros"
        />
        <StatCard
          title="Solicitudes"
          value={renderValue(requestsCount)}
          icon={<AssignmentIcon />}
          color="#dc2626"
          subtitle="Peticiones pendientes"
        />
        <StatCard
          title="Evaluaciones"
          value={renderValue(evaluationsCount)}
          icon={<AssignmentIcon />}
          color="#7c3aed"
          subtitle="Valoraciones registradas"
        />
      </div>
    </PageLayout>
  )
}

export default Dashboard;