import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
// import NavBar from '../../components/navbar/Navbar'
import "../../styles/agency.css"
// import logo from '../../assets/k-pop-logo.png';
import Form from '../../components/form/Form';
import formFieldsByEntity from '../../formSource';


const Agency : React.FC = () =>{
  const handleSubmit = (data: FormData | Record<string, any>) => {
    // Por ahora sólo mostramos en consola; más adelante se conectará a la API
    if (data instanceof FormData) {
      const obj: Record<string, any> = {};
      data.forEach((v, k) => { obj[k] = v; });
      console.log('submit agency', obj);
    } else {
      console.log('submit agency', data);
    }
  };

  return (
    <div className='Agency-sidebar'>
      <Sidebar/>
      <div className='Agency-navbar'>
        {/* <NavBar/> */}

        <div className='Agency-content'>
          <div className="agency-header">
            <div className='welcome-card'>
              {/* <img src={logo} alt='IS-K Pop' className='welcome-logo' /> */}
              <div className='welcome-text'>
                <h1>Agency</h1>
                <p className="hint">Usa este formulario para crear o editar registros.</p>
              </div>
            </div>
          </div>

          {/* Formulario mostrado siempre, directamente */}
          <div className="agency-form" style={{ marginTop: 14 }}>
            <div className="form-center">
              <Form fields={formFieldsByEntity['apprentice' as any] ? formFieldsByEntity['agency'] : formFieldsByEntity['agency']} entity="Agencia" onSubmit={handleSubmit} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Agency;