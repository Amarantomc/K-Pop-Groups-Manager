import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
// import NavBar from '../../components/navbar/Navbar'
import "../../styles/agency.css"
// import logo from '../../assets/k-pop-logo.png';
import Form from '../../components/form/Form';
import formFieldsByEntity from '../../formSource';


const Agency : React.FC = () =>{
  const handleSubmit = (data: FormData | Record<string, any>) => {
    // Enviar al backend
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else Object.assign(payload, data);

    (async () => {
      try {
        // Normalizaciones para coincidir con CreateAgencyDTO: name, address, foundation
        if (!payload.address && payload.location) payload.address = payload.location;
        if (!payload.foundation && payload.foundedAt) payload.foundation = payload.foundedAt;

        // Validación cliente mínima
        if (!payload.name || !payload.address || !payload.foundation) {
          alert('Faltan campos requeridos: name, address o foundation');
          return;
        }

        // Asegurar fecha ISO para foundation
        try {
          const d = new Date(payload.foundation);
          if (!isNaN(d.getTime())) payload.foundation = d.toISOString();
        } catch (e) { /* ignore */ }

        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const url = `${API_BASE}/api/agency/`;
        if (import.meta.env.MODE === 'development') console.debug('[Agency] POST', url, 'payload:', payload);

        // Endpoint para crear agencia: POST /api/agency/
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          // intentar leer JSON o texto crudo para dar feedback útil
          let msg = 'Error al crear agencia';
          try {
            const txt = await res.text();
            try { const j = JSON.parse(txt); msg = j?.message || j?.error || txt || msg; }
            catch { msg = txt || msg; }
          } catch (e) {}
          alert(msg);
          return;
        }

        // consumir respuesta si es JSON, pero no es obligatorio
        await res.json().catch(() => null);
        alert('Agencia creada correctamente');
      } catch (err) {
        console.error('Error creando agencia:', err);
        alert(err instanceof Error ? err.message : 'Error de red');
      }
    })();
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