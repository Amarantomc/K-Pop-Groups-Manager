import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import NavBar from '../../components/navbar/Navbar'
import "../../styles/agency.css"
// import logo from '../../assets/k-pop-logo.png';
import Form from '../../components/form/Form';
import formFieldsByEntity from '../../formSource';


const Agency : React.FC = () =>{
  const [showAgencyForm, setShowAgencyForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [memberType, setMemberType] = useState<'artist'|'apprentice'|null>(null);

  const handleSubmit = (data: FormData | Record<string, any>) => {
    // mostrar en consola; en el futuro reemplazar por POST a la API
    if (data instanceof FormData) {
      const obj: Record<string, any> = {};
      data.forEach((v, k) => { obj[k] = v; });
      console.log('submit', obj);
    } else {
      console.log('submit', data);
    }
    // cerrar formularios tras enviar
    setShowAgencyForm(false);
    setShowMemberForm(false);
    setMemberType(null);
  };

  // Placeholder handlers for future data fetching / DB integration.
  // Cuando el backend y las tablas estén listas, estos métodos deben:
  // - llamar a un endpoint REST (GET /api/agencies, GET /api/apprentices)
  // - almacenar la respuesta en estado local y mostrarla (tabla/panel)
  // - manejar loading / errors y paginación si aplica
  const handleShowAgencies = () => {
    // TODO: implementar fetch a la API para obtener agencias.
    // Ejemplo (cuando haya API):
    // setLoading(true);
    // fetch('/api/agencies').then(...)
    console.log('Mostrar agencias (placeholder)');
  };

  const handleShowApprentices = () => {
    // TODO: implementar fetch a la API para obtener aprendices.
    // Requerirá que el compañero cree las tablas y exponga el endpoint.
    console.log('Mostrar aprendices (placeholder)');
  };

  return (
    <div className='Agency-sidebar'>
      <Sidebar/>
      <div className='Agency-navbar'>
        <NavBar/>

        <div className='Agency-content'>
          <div className="agency-header">
            <div className='welcome-card'>
              {/* <img src={logo} alt='IS-K Pop' className='welcome-logo' /> */}
              <div className='welcome-text'>
                <h1>Agency</h1>
                <p className="hint">Administra agencias, artistas y actividades desde aquí.</p>
              </div>
            </div>
          </div>

          {/* botones principales (debajo del header) */}
          <div className="agency-actions" style={{ marginTop: 12 }}>
            <button className="primary-btn" onClick={() => { setShowAgencyForm(!showAgencyForm); setShowMemberForm(false); setMemberType(null); }}>
              Añadir agencia
            </button>
            <button className="primary-btn" onClick={() => { setShowMemberForm(!showMemberForm); setShowAgencyForm(false); setMemberType(null); }}>
              Añadir miembro
            </button>
            <button className="secondary-btn" onClick={() => handleShowAgencies()}>
              Mostrar agencias
            </button>
            <button className="secondary-btn" onClick={() => handleShowApprentices()}>
              Mostrar aprendices
            </button>
          </div>

          {showAgencyForm && (
            <div className="agency-form">
              <div className="form-center">
                <Form fields={formFieldsByEntity['agency']} entity="Agencia" onSubmit={handleSubmit} />
              </div>
            </div>
          )}

          {showMemberForm && (
            <div className="member-area">
              <div className="member-select">
                <label>Tipo de miembro: </label>
                <button className={`chip ${memberType==='artist' ? 'active' : ''}`} onClick={() => setMemberType('artist')}>Artista</button>
                <button className={`chip ${memberType==='apprentice' ? 'active' : ''}`} onClick={() => setMemberType('apprentice')}>Aprendiz</button>
              </div>

              {memberType && (
                <div className="member-form">
                  <div className="form-center">
                    <Form fields={formFieldsByEntity[memberType]} entity={memberType === 'artist' ? 'Artista' : 'Aprendiz'} onSubmit={handleSubmit} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Agency;