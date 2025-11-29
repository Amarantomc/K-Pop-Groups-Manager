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
                { label: "Inicio", icon: <DashboardIcon />, path: "/admin/dashboard" }
            ]
        },
        {
            title: "AGENCIA",
            items: [
                { label: "Añadir Agencia", icon: <AddBusinessIcon />, path: "/admin/agency" },
                { label: "Mostrar Agencias", icon: <AddBusinessIcon />, path: "/admin/listAgency" }
            ]
        },
        {
            title: "APRENDIZ",
            items: [
                { label: "Añadir Aprendiz", icon: <PersonAddIcon />, path: "/admin/apprentices" },
                { label: "Mostrar Aprendices", icon: <PersonAddIcon />, path: "/admin/listApprentice" }
            ]
        },
        {
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/admin/profile" },
                { label: "Usuarios Registrados", icon: <AccountCircleIcon />, path: "/admin/listUsers" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login", onclick: () => { } }
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
            title: "GESTIÓN",
            items: [
                { label: "Aprendices", icon: <PersonAddIcon />, path: "/manager/apprentices" }
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
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/apprentice/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
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
            title: "CUENTA",
            items: [
                { label: "Perfil", icon: <AccountCircleIcon />, path: "/director/profile" },
                { label: "Cerrar Sesión", icon: <LogoutIcon />, path: "/login" }
            ]
        }
    ]
}