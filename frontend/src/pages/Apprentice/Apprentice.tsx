import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Form from '../../components/form/Form';
import formFieldsByEntity from '../../formSource';
import "../../styles/apprentice.css";

const Apprentice: React.FC = () => {
  const handleSubmit = (data: FormData | Record<string, any>) => {
    if (data instanceof FormData) {
      const obj: Record<string, any> = {};
      data.forEach((v, k) => { obj[k] = v; });
      console.log('submit apprentice', obj);
    } else {
      console.log('submit apprentice', data);
    }
  };

  return (
    <div className='listApprenticeSideBar'>
      <Sidebar />
      <div className='listApprenticeNavBar'>
        <div className='agency-header'>
          <div className='welcome-card'>
            <div className='welcome-text'>
              <h1>Aprendices</h1>
              <p className='hint'>Usa este formulario para crear o editar registros.</p>
            </div>
          </div>
        </div>

        {/* Formulario mostrado directamente, sin botones de "Mostrar" */}
        <div style={{ padding: 16 }}>
          <div className="form-center">
            <Form fields={formFieldsByEntity['apprentice']} entity="Aprendiz" onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apprentice;
