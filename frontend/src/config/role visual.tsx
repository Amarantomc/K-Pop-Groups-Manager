import type React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
//import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AlbumIcon from '@mui/icons-material/Album';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
//import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolIcon from '@mui/icons-material/School';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import WorkIcon from '@mui/icons-material/Work';
//import CheckCircleIcon from '@mui/icons-material/CheckCircle';
//import ScheduleIcon from '@mui/icons-material/Schedule';
//import HistoryIcon from '@mui/icons-material/History';
//import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
//import EventAvailableIcon from '@mui/icons-material/EventAvailable';
//import WarningIcon from '@mui/icons-material/Warning';
//import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
//import ThumbUpIcon from '@mui/icons-material/ThumbUp';
//import TrendingUpIcon from '@mui/icons-material/TrendingUp';
//import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
//import SettingsIcon from '@mui/icons-material/Settings';
//import BackupIcon from '@mui/icons-material/Backup';

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
<<<<<<< HEAD
<<<<<<< HEAD
        {
            title: "ARTISTA",
            items: [
                { label: "Gestión de Artistas", icon: <PeopleIcon />, path: "/admin/Artist" }
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
                { label: "Ingresos del Sistema", icon: <AttachMoneyIcon />, path: "/manager/income" }
            ]
        },
        {
            title: "SOLICITUD",
            items: [
                { label: "Solicitudes", icon: <NotificationsIcon />, path: "/admin/requests" }
            ]
        },
=======
        // {
        //     title: "ARTISTA",
        //     items: [
        //         { label: "Gestión de Artistas", icon: <PeopleIcon />, path: "/admin/Artist" }
        //     ]
        // },
        // {
        //     title: "GRUPO ",
        //     items: [
        //         { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/admin/Groups" }
        //     ]
        // },
        // {
        //     title: "ALBUM",
        //     items: [
        //         { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/admin/listAlbums" }
        //     ]
        // },
        // {
        //     title: "ACTIVIDAD",
        //     items: [
        //         { label: "Mostrar Actividades", icon: <CalendarTodayIcon />, path: "/admin/Activities" }
        //     ]
        // },
        // {
        //     title: "CONTRATO",
        //     items: [
        //         { label: "Mostrar Contratos", icon: <WorkIcon />, path: "/admin/contracts" }
        //     ]
        // },
        // {
        //     title: "INGRESOS",
        //     items: [
        //         { label: "Ingresos del Sistema", icon: <AttachMoneyIcon />, path: "/admin/income" }
        //     ]
        // },
        // {
        //     title: "SOLICITUD",
        //     items: [
        //         { label: "Solicitudes", icon: <NotificationsIcon />, path: "/admin/requests" }
        //     ]
        // },
>>>>>>> d6ac524 (fix add button)
=======
>>>>>>> 8ea7c42 (update endpoint artist)
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
<<<<<<< HEAD
                { label: "Crear Grupo", icon: <GroupAddIcon />, path: "/manager/groups" },
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/manager/listGroups" }
=======
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/director/group" }
>>>>>>> 8ea7c42 (update endpoint artist)
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
                { label: "Gestión de Actividades", icon: <CalendarTodayIcon />, path: "/director/activities"}
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
                { label: "Gestión de Artistas", icon: <PeopleIcon />, path: "/manager/artists" }
            ]
        },
        {
            title: "GRUPO ",
            items: [
<<<<<<< HEAD
                { label: "Crear Grupo", icon: <GroupAddIcon />, path: "/manager/groups" },
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/manager/listGroups" }
=======
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/manager/group" }
>>>>>>> 8ea7c42 (update endpoint artist)
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
                { label: "Gestión de Actividades", icon: <CalendarTodayIcon />, path: "/manager/activities"}
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