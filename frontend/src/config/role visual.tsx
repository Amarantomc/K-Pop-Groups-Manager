import type React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AlbumIcon from '@mui/icons-material/Album';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LogoutIcon from '@mui/icons-material/Logout';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkIcon from '@mui/icons-material/Work';

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
            title: "PageExample",
            items: [
                { label: "Example", icon: <DashboardIcon />, path: "/admin/overview" }
            ]
        },
        {
            title: "AGENCIA",
            items: [
                { label: "Mostrar Agencias", icon: <BusinessIcon />, path: "/admin/agency" }
            ]
        },
        {
            title: "APRENDIZ",
            items: [
                { label: "Mostrar Aprendices", icon: <SchoolIcon />, path: "/admin/apprentice" }
            ]
        },
        {
            title: "ARTISTA",
            items: [
                { label: "Gestión de Artistas", icon: <PeopleIcon />, path: "/admin/artists" }
            ]
        },
        {
            title: "GRUPO ",
            items: [
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/admin/groups" }
            ]
        },
        {
            title: "CONCEPTO",
            items: [
                { label: "Mostrar Conceptos", icon: <LightbulbIcon />, path: "/admin/concept" }
            ]
        },
        {
            title: "CONCEPTO VISUAL",
            items: [
                { label: "Mostrar Conceptos Visuales", icon: <PaletteIcon />, path: "/admin/concept-visual" }
            ]
        },
        {
            title: "LISTAS DE POPULARIDAD",
            items: [
                { label: "Mostrar Listas de Popularidad", icon: <TrendingUpIcon />, path: "/admin/popularity-lists" }
            ]
        },
        {
            title: "PREMIO",
            items: [
                { label: "Mostrar Premios", icon: <EmojiEventsIcon />, path: "/admin/award" }
            ]
        },
        {
            title: "CANCIÓN",
            items: [
                { label: "Mostrar Canciones", icon: <MusicNoteIcon />, path: "/admin/songs" }
            ]
        },
        {
            title: "ALBUM",
            items: [
                { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/admin/albums" }
            ]
        },
        {
            title: "ACTIVIDAD",
            items: [
                { label: "Mostrar Actividades", icon: <CalendarTodayIcon />, path: "/admin/activities" }
            ]
        },
        {
            title: "CONTRATO",
            items: [
                { label: "Mostrar Contratos", icon: <WorkIcon />, path: "/admin/contracts" }
            ]
        },
        {
            title: "INGRESOS",
            items: [
                { label: "Ingresos del Sistema", icon: <AttachMoneyIcon />, path: "/admin/income" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Solicitudes", icon: <NotificationsIcon />, path: "/admin/request" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/admin/profile" },
                { label: "Usuarios Registrados", icon: <PeopleIcon />, path: "/admin/users" },
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
                { label: "Mostrar Aprendices", icon: <SchoolIcon />, path: "/director/apprentice" }
            ]
        },
        {
            title: "ARTISTA",
            items: [
                { label: "Gestión de Artistas", icon: <PeopleIcon />, path: "/director/artists" }
            ]
        },
        {
            title: "GRUPO ",
            items: [
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/director/group" }
            ]
        },
         {
            title: "CONCEPTO",
            items: [
                { label: "Mostrar Conceptos", icon: <LightbulbIcon />, path: "/director/concept" }
            ]
        },
        {
            title: "CONCEPTO VISUAL",
            items: [
                { label: "Mostrar Conceptos Visuales", icon: <PaletteIcon />, path: "/director/concept-visual" }
            ]
        },
        {
            title: "LISTAS DE POPULARIDAD",
            items: [
                { label: "Mostrar Listas de Popularidad", icon: <TrendingUpIcon />, path: "/director/popularity-lists" }
            ]
        },
        {
            title: "PREMIO",
            items: [
                { label: "Mostrar Premios", icon: <EmojiEventsIcon />, path: "/director/award" }
            ]
        },
        {
            title: "CANCIÓN",
            items: [
                { label: "Mostrar Canciones", icon: <MusicNoteIcon />, path: "/director/songs" }
            ]
        },
        {
            title: "ALBUM",
            items: [
                { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/director/albums" }
            ]
        },
        {
            title: "ACTIVIDAD",
            items: [
                { label: "Gestión de Actividades", icon: <CalendarTodayIcon />, path: "/director/activities" }
            ]
        },
        {
            title: "CONTRATO",
            items: [
                { label: "Mostrar Contratos", icon: <WorkIcon />, path: "/director/contracts" }
            ]
        },
        {
            title: "INGRESOS",
            items: [
                { label: "Mis Ingresos", icon: <AttachMoneyIcon />, path: "/director/income" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Solicitudes", icon: <NotificationsIcon />, path: "/director/request" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/director/profile" },
                // { label: "Usuarios Registrados", icon: <PeopleIcon />, path: "/director/listUsers" },
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
                { label: "Mostrar Aprendices", icon: <SchoolIcon />, path: "/manager/apprentice" }
            ]
        },
        {
            title: "ARTISTA",
            items: [
                { label: "Gestión de Artistas", icon: <PeopleIcon />, path: "/manager/artists" },
                //{label: "Artistas activos", icon:<PeopleIcon/>, path:"/manager/artists-active"}
            ]
        },
        {
            title: "GRUPO ",
            items: [
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/manager/group" }
            ]
        },
         {
            title: "CONCEPTO",
            items: [
                { label: "Mostrar Conceptos", icon: <LightbulbIcon />, path: "/manager/concept" }
            ]
        },
        {
            title: "CONCEPTO VISUAL",
            items: [
                { label: "Mostrar Conceptos Visuales", icon: <PaletteIcon />, path: "/manager/concept-visual" }
            ]
        },
        {
            title: "LISTAS DE POPULARIDAD",
            items: [
                { label: "Mostrar Listas de Popularidad", icon: <TrendingUpIcon />, path: "/manager/popularity-lists" }
            ]
        },
        {
            title: "PREMIO",
            items: [
                { label: "Mostrar Premios", icon: <EmojiEventsIcon />, path: "/manager/award" }
            ]
        },
        {
            title: "CANCIÓN",
            items: [
                { label: "Mostrar Canciones", icon: <MusicNoteIcon />, path: "/manager/songs" }
            ]
        },
        {
            title: "ALBUM",
            items: [
                { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/manager/albums" }
            ]
        },
        {
            title: "ACTIVIDAD",
            items: [
                { label: "Gestión de Actividades", icon: <CalendarTodayIcon />, path: "/manager/activities" }
            ]
        },
        {
            title: "CONTRATO",
            items: [
                { label: "Mostrar Contratos", icon: <WorkIcon />, path: "/manager/contracts" }
            ]
        },
        {
            title: "INGRESOS",
            items: [
                { label: "Mis Ingresos", icon: <AttachMoneyIcon />, path: "/manager/income" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Solicitudes", icon: <NotificationsIcon />, path: "/manager/request" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/manager/profile" },
                // { label: "Usuarios Registrados", icon: <PeopleIcon />, path: "/manager/listUsers" },
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
                { label: "Calendario", icon: <CalendarTodayIcon />, path: "/artist/activities" }
            ]
        },
        {
            title: "INGRESOS",
            items: [
                { label: "Mis Ingresos", icon: <AttachMoneyIcon />, path: "/artist/income" }
            ]
        },
        {
            title: "LISTAS DE POPULARIDAD",
            items: [
                { label: "Mostrar Listas de Popularidad", icon: <TrendingUpIcon />, path: "/artist/popularity-lists" }
            ]
        },
        {
            title: "PREMIO",
            items: [
                { label: "Mostrar Premios", icon: <EmojiEventsIcon />, path: "/artist/award" }
            ]
        },
        {
            title: "ÁLBUM",
            items: [ 
                { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/artist/albums" }
            ]
        },
        {
            title: "CANCIÓN",
            items: [
                { label: "Mostrar Canciones", icon: <MusicNoteIcon />, path: "/artist/songs" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Mis Solicitudes", icon: <NotificationsIcon />, path: "/artist/request" }
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
                { label: "Mis Solicitudes", icon: <NotificationsIcon />, path: "/apprentice/request" }
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