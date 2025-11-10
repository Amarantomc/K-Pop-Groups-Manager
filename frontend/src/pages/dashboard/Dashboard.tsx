import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
// import NavBar from '../../components/navbar/Navbar'
import "../../styles/dashboard.css"
import logo from '../../assets/k-pop-logo.png';


const Dashboard : React.FC = () =>{
  return (
    <div className='dashboard-sidebar'>
      <Sidebar/>
      <div className='dashboard-navbar'>
        {/* <NavBar/> */}

        <div className='dashboard-content'>
          <div className='welcome-card'>
            <img src={logo} alt='IS-K Pop' className='welcome-logo' />
            <div className='welcome-text'>
              <h2>Bienvenido a Gestión de Agencias del K-Pop</h2>
              <p>Administra agencias, artistas y actividades desde este panel. Aquí tienes un resumen rápido para comenzar.</p>
            </div>
          </div>

          <div className='quick-stats'>
            <div className='stat'>
              <div className='stat-value'>12</div>
              <div className='stat-label'>Agencias</div>
            </div>
            <div className='stat'>
              <div className='stat-value'>34</div>
              <div className='stat-label'>Artistas</div>
            </div>
            <div className='stat'>
              <div className='stat-value'>5</div>
              <div className='stat-label'>Eventos hoy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;