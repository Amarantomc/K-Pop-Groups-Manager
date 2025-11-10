import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Form from '../../components/form/Form';
import formFieldsByEntity from '../../formSource';
import "../../styles/apprentice.css";

const Apprentice: React.FC = () => {
  const handleSubmit = (data: FormData | Record<string, any>) => {
<<<<<<< Updated upstream
    if (data instanceof FormData) {
      const obj: Record<string, any> = {};
      data.forEach((v, k) => { obj[k] = v; });
      console.log('submit apprentice', obj);
    } else {
      console.log('submit apprentice', data);
    }
=======
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else Object.assign(payload, data);

    (async () => {
      try {
        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

  // aqui va el endpoint
  const res = await fetch(`${API_BASE}/api/apprentice`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          let msg = 'Error al crear aprendiz';
          try { const j = await res.json(); msg = j?.message || j?.error || msg; } catch(e) {}
          alert(msg);
          return;
        }

        await res.json();
        alert('Aprendiz creado correctamente');
      } catch (err) {
        console.error('Error creando aprendiz:', err);
        alert(err instanceof Error ? err.message : 'Error de red');
      }
    })();
>>>>>>> Stashed changes
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
