import "../../styles/sidebar.css"
import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import QuizIcon from '@mui/icons-material/Quiz';
import CelebrationIcon from '@mui/icons-material/Celebration';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HistoryIcon from '@mui/icons-material/History';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from "../../assets/k-pop-logo.png"
import {useAuth} from "../../contexts/AuthContext"
const Sidebar : React.FC = () => {
    const {logout} = useAuth();
    return (
        <div className="sidebar">
            <div className="top">
                <img src={logo} alt="KPop-Dashboard" className="logo"/>
            </div>
            <hr/>
            <div className="center">
                <ul>
                    <p className="title">INICIO</p>
                    <li>
                        <DashboardIcon className="icon"/>
                        <span>Inicio</span>
                    </li>
                    <p className="title">AGENCIA</p>
                    <li>
                        <PersonAddIcon className="icon"/>
                        <span>Añadir Miembro</span>
                    </li>
                    <li>
                        <PendingActionsIcon className="icon"/>
                        <span>Ver Solicitudes</span>
                    </li>
                    <li>
                        <QuizIcon className="icon"/>
                        <span>Evaluar Aprendiz</span>
                    </li>
                    <p className="title">ACTIVIDAD</p>
                    <li>
                        <CelebrationIcon className="icon"/>
                        <span>Crear Actividad</span>
                    </li>
                    <li>
                        <CalendarMonthIcon className="icon"/>
                        <span>Calendario</span>
                    </li>
                    <li>
                        <PersonIcon className="icon"/>
                        <span>Artistas Debutados</span>
                    </li>
                    <li>
                        <AttachMoneyIcon className="icon"/>
                        <span>Ingresos</span>
                    </li>
                    <li>
                        <HistoryIcon className="icon"/>
                        <span>Historial Artista</span>
                    </li>
                    <li>
                        <HistoryIcon className="icon"/>
                        <span>Historial Artista Exitoso</span>
                    </li>
                    <p className="title">SOLICITUD</p>
                    <li>
                        <DescriptionIcon className="icon"/>
                        <span>Solicitud Aprendiz</span>
                    </li>
                    <li>
                        <DescriptionIcon className="icon"/>
                        <span>Solicitud Artista</span>
                    </li>
                    <li>
                        <DescriptionIcon className="icon"/>
                        <span>Solicitud Manager</span>
                    </li>
                    <p className="title">CUENTA</p>
                    <li>
                        <AccountCircleIcon className="icon"/>
                        <span>Perfil</span>
                    </li>
                    <li onClick={logout}>
                        <LogoutIcon className="icon"/>
                        <span>Cerrar Sesión</span>
                    </li>
                </ul>
            </div>
            <div className="bottom">
                <div className="colorOption"></div>
                <div className="colorOption"></div>
            </div>
        </div>
    )
}

export default Sidebar