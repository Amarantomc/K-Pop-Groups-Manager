import "../../styles/sidebar.css"
import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
// import PersonIcon from '@mui/icons-material/Person';
// import PendingActionsIcon from '@mui/icons-material/PendingActions';
// import QuizIcon from '@mui/icons-material/Quiz';
// import CelebrationIcon from '@mui/icons-material/Celebration';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import HistoryIcon from '@mui/icons-material/History';
// import DescriptionIcon from '@mui/icons-material/Description';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from "../../assets/k-pop-logo.png"
import {useAuth} from "../../contexts/AuthContext"
import { Link } from "react-router-dom";

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
                        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <DashboardIcon className="icon"/>
                            <span>Inicio</span>
                        </Link>
                    </li>
                    <p className="title">AGENCIA</p>
                    <li>
                        <Link to="/agency" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PersonAddIcon className="icon"/>
                            <span>Añadir Agencia</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/listAgency" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PersonAddIcon className="icon"/>
                            <span>Mostrar Agencias</span>
                        </Link>
                    </li>
                    <p className="title">APRENDIZ</p>
                    <li>
                            <PersonAddIcon className="icon"/>
                            <span>Añadir Aprendiz</span>
                    </li>
                    <li>
                        <Link to="/listApprentice" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <PersonAddIcon className="icon"/>
                            <span>Mostrar Aprendices</span>
                        </Link>
                    </li>
                    {/* <li>
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
                    </li> */}
                    <p className="title">CUENTA</p>
                    <li>
                        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <AccountCircleIcon className="icon"/>
                            <span>Perfil</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/listUsers" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <AccountCircleIcon className="icon"/>
                            <span>Usuarios Registrados</span>
                        </Link>
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