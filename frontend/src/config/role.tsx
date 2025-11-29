import type React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export interface MenuItem{
    label : string;
    icon : React.ReactNode;
    path : string;
    onclick? : () => void;
}

export interface MenuSection{
    title : string;
    items : MenuItem[];
}

export const MenuByRole : Record<string,MenuSection[]> = {
    ADMIN : [
        {
            title : "INICIO",
            items : [
                {label : "Inicio",icon : <DashboardIcon/>,path : "/dashboard" }
            ]
        },
        {
            title : "AGENCIA",
            items : [
                {label : "Añadir Agencia",icon : <AddBusinessIcon/>,path : "/agency" },
                {label : "Mostrar Agencias",icon : <AddBusinessIcon/>,path : "/listAgency" }
            ]
        },
        {
            title : "APRENDIZ",
            items : [
                {label : "Añadir Aprendiz",icon : <PersonAddIcon/>,path : "/apprentices" },
                {label : "Mostrar Aprendices",icon : <PersonAddIcon/>,path : "/listApprentice" }
            ]
        },
        {
            title : "CUENTA",
            items : [
                {label : "Perfil",icon : <AccountCircleIcon/>,path : "/profile" },
                {label : "Usuarios Registrados",icon : <AccountCircleIcon/>,path : "/listUsers" },
                {label : "Cerrar Sesión",icon : <LogoutIcon/>,path : "/login", onclick: () => {} }
            ]
        }
    ]
}