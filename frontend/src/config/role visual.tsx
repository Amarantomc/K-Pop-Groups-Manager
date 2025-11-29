import type React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

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
                { label: "Inicio", icon: <DashboardIcon />, path: "/dashboard" }
            ]
        },
        {
            title: "AGENCIA",
            items: [
                { label: "Añadir Agencia", icon: <AddBusinessIcon />, path: "/agency" },
                { label: "Mostrar Agencias", icon: <AddBusinessIcon />, path: "/listAgency" }
            ]
        },
        {
            title: "APRENDIZ",
            items: [
                { label: "Añadir Aprendiz", icon: <PersonAddIcon />, path: "/apprentices" },
                { label: "Mostrar Aprendices", icon: <PersonAddIcon />, path: "/listApprentice" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/profile" },
                { label: "Usuarios Registrados", icon: <AccountCircleIcon />, path: "/listUsers" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login", onclick: () => { } }
            ]
        }
    ],

    // 🆕 AGREGAR ESTOS ROLES NUEVOS
    manager: [
        {
            title: "INICIO",
            items: [
                { label: "Inicio", icon: <DashboardIcon />, path: "/dashboard" }
            ]
        },
        {
            title: "GESTIÓN",
            items: [
                { label: "Aprendices", icon: <PersonAddIcon />, path: "/listApprentice" },
                { label: "Artistas", icon: <PersonAddIcon />, path: "/manager/artists" },
                { label: "Actividades", icon: <DashboardIcon />, path: "/manager/activities" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
            ]
        }
    ],

    artist: [
        {
            title: "INICIO",
            items: [
                { label: "Inicio", icon: <DashboardIcon />, path: "/dashboard" }
            ]
        },
        {
            title: "MI CARRERA",
            items: [
                { label: "Mi Agenda", icon: <DashboardIcon />, path: "/artist/schedule" },
                { label: "Mis Ingresos", icon: <DashboardIcon />, path: "/artist/earnings" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
            ]
        }
    ],

    apprentice: [
        {
            title: "INICIO",
            items: [
                { label: "Inicio", icon: <DashboardIcon />, path: "/dashboard" }
            ]
        },
        {
            title: "MI FORMACIÓN",
            items: [
                { label: "Mis Evaluaciones", icon: <DashboardIcon />, path: "/apprentice/evaluations" },
                { label: "Mis Entrenamientos", icon: <DashboardIcon />, path: "/apprentice/trainings" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
            ]
        }
    ],

    director: [
        {
            title: "INICIO",
            items: [
                { label: "Inicio", icon: <DashboardIcon />, path: "/dashboard" }
            ]
        },
        {
            title: "GESTIÓN ESTRATÉGICA",
            items: [
                { label: "Aprobar Grupos", icon: <DashboardIcon />, path: "/director/approvals" },
                { label: "Validar Logros", icon: <DashboardIcon />, path: "/director/achievements" },
                { label: "Reportes", icon: <DashboardIcon />, path: "/director/reports" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
            ]
        }
    ]
}