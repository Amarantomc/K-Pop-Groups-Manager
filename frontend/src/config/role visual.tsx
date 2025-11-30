import type React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HistoryIcon from '@mui/icons-material/History';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WorkIcon from '@mui/icons-material/Work';
import AlbumIcon from '@mui/icons-material/Album';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningIcon from '@mui/icons-material/Warning';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import BackupIcon from '@mui/icons-material/Backup';

export interface MenuItem {
    label: string;
    icon: React.ReactNode;
    path: string;
    onclick?: () => void;
}

export interface MenuSection {
    title: string;
    items: MenuItem[];
}

export const MenuByRole: Record<string, MenuSection[]> = {

    admin: [
        {
            title: "INICIO",
            items: [
                { label: "Inicio", icon: <DashboardIcon />, path: "/admin/dashboard" }
            ]
        },
        {
            title: "AGENCIA",
            items: [
                { label: "Añadir Agencia", icon: <AddBusinessIcon />, path: "/admin/agency" },
                { label: "Mostrar Agencias", icon: <BusinessIcon />, path: "/admin/listAgency" }
            ]
        },
        {
            title: "APRENDIZ",
            items: [
                { label: "Añadir Aprendiz", icon: <PersonAddIcon />, path: "/admin/apprentices" },
                { label: "Mostrar Aprendices", icon: <SchoolIcon />, path: "/admin/listApprentice" }
            ]
        },
        {
            title: "ARTISTA",
            items: [
                { label: "Añadir Artista", icon: <PersonAddIcon />, path: "/admin/artists" },
                { label: "Mostrar Artistas", icon: <PeopleIcon />, path: "/admin/listArtists" }
            ]
        },
        {
            title: "GRUPO ",
            items: [
                { label: "Crear Grupo", icon: <GroupAddIcon />, path: "/manager/groups" },
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/manager/listGroups" }
            ]
        },
        {
            title: "ALBUM",
            items: [
                { label: "Crear Álbum", icon: <AlbumIcon />, path: "/manager/albums" },
                { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/manager/listAlbums" }
            ]
        },
        {
            title: "ACTIVIDAD",
            items: [
                { label: "Crear Actividad", icon: <CalendarTodayIcon />, path: "/manager/activities" },
                { label: "Mostrar Actividades", icon: <ViewTimelineIcon />, path: "/manager/listActivities" }
            ]
        },
        {
            title: "CONTRATO",
            items: [
                { label: "Crear Contrato", icon: <WorkIcon />, path: "/manager/contracts" },
                { label: "Mostrar Contratos", icon: <DescriptionIcon />, path: "/manager/listContracts" }
            ]
        },
        {
            title: "INGRESOS",
            items: [
                { label: "Mis Ingresos", icon: <AttachMoneyIcon />, path: "/manager/earnings" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Solicitudes", icon: <NotificationsIcon />, path: "/admin/requests" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/admin/profile" },
                { label: "Usuarios Registrados", icon: <PeopleIcon />, path: "/admin/listUsers" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login", onclick: () => { } }
            ]
        }
    ],
    director: [
        {
            title: "INICIO",
            items: [
                { label: "Inicio", icon: <DashboardIcon />, path: "/director/dashboard" }
            ]
        },
        {
            title: "APRENDIZ",
            items: [
                { label: "Mostrar Aprendices", icon: <SchoolIcon />, path: "/admin/listApprentice" }
            ]
        },
        {
            title: "ARTISTA",
            items: [
                { label: "Añadir Artista", icon: <PersonAddIcon />, path: "/manager/artists" },
                { label: "Mostrar Artistas", icon: <PeopleIcon />, path: "/manager/listArtists" }
            ]
        },
        {
            title: "GRUPO ",
            items: [
                { label: "Crear Grupo", icon: <GroupAddIcon />, path: "/manager/groups" },
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/manager/listGroups" }
            ]
        },
        {
            title: "ALBUM",
            items: [
                { label: "Crear Álbum", icon: <AlbumIcon />, path: "/manager/albums" },
                { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/manager/listAlbums" }
            ]
        },
        {
            title: "ACTIVIDAD",
            items: [
                { label: "Crear Actividad", icon: <CalendarTodayIcon />, path: "/manager/activities" },
                { label: "Mostrar Actividades", icon: <ViewTimelineIcon />, path: "/manager/listActivities" }
            ]
        },
        {
            title: "CONTRATO",
            items: [
                { label: "Crear Contrato", icon: <WorkIcon />, path: "/manager/contracts" },
                { label: "Mostrar Contratos", icon: <DescriptionIcon />, path: "/manager/listContracts" }
            ]
        },
        {
            title: "INGRESOS",
            items: [
                { label: "Mis Ingresos", icon: <AttachMoneyIcon />, path: "/manager/earnings" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Solicitudes", icon: <AssessmentIcon />, path: "/director/requests" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/director/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
            ]
        }
    ],

    manager: [
        {
            title: "INICIO",
            items: [
                { label: "Inicio", icon: <DashboardIcon />, path: "/manager/dashboard" }
            ]
        },
        {
            title: "APRENDIZ",
            items: [
                { label: "Añadir Aprendiz", icon: <PersonAddIcon />, path: "/manager/apprentices" },
                { label: "Mostrar Aprendices", icon: <SchoolIcon />, path: "/manager/listApprentice" }
            ]
        },
        {
            title: "ARTISTA",
            items: [
                { label: "Añadir Artista", icon: <PersonAddIcon />, path: "/manager/artists" },
                { label: "Mostrar Artistas", icon: <PeopleIcon />, path: "/manager/listArtists" }
            ]
        },
        {
            title: "GRUPO ",
            items: [
                { label: "Crear Grupo", icon: <GroupAddIcon />, path: "/manager/groups" },
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/manager/listGroups" }
            ]
        },
        {
            title: "ALBUM",
            items: [
                { label: "Crear Álbum", icon: <AlbumIcon />, path: "/manager/albums" },
                { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/manager/listAlbums" }
            ]
        },
        {
            title: "ACTIVIDAD",
            items: [
                { label: "Crear Actividad", icon: <CalendarTodayIcon />, path: "/manager/activities" },
                { label: "Mostrar Actividades", icon: <ViewTimelineIcon />, path: "/manager/listActivities" }
            ]
        },
        {
            title: "CONTRATO",
            items: [
                { label: "Crear Contrato", icon: <WorkIcon />, path: "/manager/contracts" },
                { label: "Mostrar Contratos", icon: <DescriptionIcon />, path: "/manager/listContracts" }
            ]
        },
        {
            title: "INGRESOS",
            items: [
                { label: "Mis Ingresos", icon: <AttachMoneyIcon />, path: "/manager/earnings" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Solicitudes", icon: <NotificationsIcon />, path: "/manager/requests" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/manager/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
            ]
        }
    ],

    artist: [
        {
            title: "INICIO",
            items: [
                { label: "Inicio", icon: <DashboardIcon />, path: "/artist/dashboard" }
            ]
        },
        {
            title: "ACTIVIDAD",
            items: [
                { label: "Calendario", icon: <CalendarTodayIcon />, path: "/artist/activity" }
            ]
        },
        {
            title: "INGRESOS",
            items: [
                { label: "Mis Ingresos", icon: <AttachMoneyIcon />, path: "/artist/earnings" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Mis Solicitudes", icon: <NotificationsIcon />, path: "/artist/requests" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/artist/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
            ]
        }
    ],

    apprentice: [
        {
            title: "INICIO",
            items: [
                { label: "Inicio", icon: <DashboardIcon />, path: "/apprentice/dashboard" }
            ]
        },
        {
            title: "EVALUACIÓN",
            items: [
                { label: "Mis Evaluaciones", icon: <AssessmentIcon />, path: "/apprentice/evaluations" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Mis Solicitudes", icon: <NotificationsIcon />, path: "/apprentice/requests" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/apprentice/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
            ]
        }
    ]
}