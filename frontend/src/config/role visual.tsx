import type React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AlbumIcon from '@mui/icons-material/Album';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
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
            title: "AGENCIA",
            items: [
                { label: "Mostrar Agencias", icon: <BusinessIcon />, path: "/admin/agency" }
            ]
        },
        {
            title: "APRENDIZ",
            items: [
                { label: "Mostrar Aprendices", icon: <SchoolIcon />, path: "/admin/apprentices" }
            ]
        },
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
                { label: "Mostrar Aprendices", icon: <SchoolIcon />, path: "/director/apprentices" }
            ]
        },
        {
            title: "ARTISTA",
            items: [
                { label: "Gestión de Artistas", icon: <PeopleIcon />, path: "/director/Artist" }
            ]
        },
        {
            title: "GRUPO ",
            items: [
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/director/Groups" }
            ]
        },
        {
            title: "ALBUM",
            items: [
                { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/director/Albums" }
            ]
        },
        {
            title: "ACTIVIDAD",
            items: [
                { label: "Gestión de Actividades", icon: <CalendarTodayIcon />, path: "/director/Activities"}
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
                { label: "Solicitudes", icon: <NotificationsIcon />, path: "/director/requests" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/director/profile" },
                { label: "Usuarios Registrados", icon: <PeopleIcon />, path: "/director/listUsers" },
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
                { label: "Mostrar Aprendices", icon: <SchoolIcon />, path: "/manager/apprentices" }
            ]
        },
        {
            title: "ARTISTA",
            items: [
                { label: "Gestión de Artistas", icon: <PeopleIcon />, path: "/manager/Artist" }
            ]
        },
        {
            title: "GRUPO ",
            items: [
                { label: "Mostrar Grupos", icon: <PeopleIcon />, path: "/manager/Groups" }
            ]
        },
        {
            title: "ALBUM",
            items: [
                { label: "Mostrar Álbumes", icon: <AlbumIcon />, path: "/manager/Albums" }
            ]
        },
        {
            title: "ACTIVIDAD",
            items: [
                { label: "Gestión de Actividades", icon: <CalendarTodayIcon />, path: "/manager/Activities"}
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
                { label: "Solicitudes", icon: <NotificationsIcon />, path: "/manager/requests" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/manager/profile" },
                { label: "Usuarios Registrados", icon: <PeopleIcon />, path: "/manager/listUsers" },
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
                { label: "Calendario", icon: <CalendarTodayIcon />, path: "/artist/Activities" }
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