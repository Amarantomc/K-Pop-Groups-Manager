/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Form from '../../components/form/Form';
import formFieldsByEntity, { APPRENTICE_STATUS, APPRENTICE_STATUS_OPTIONS } from '../../config/formSource';
import "./apprentice.css";
import Header from '../../components/header/Header';
import { useAuth } from '../../../contexts/auth/AuthContext';

const Apprentice: React.FC = () => {
  const { user } = useAuth();
  const handleSubmit = (data: FormData | Record<string, any>) => {
    const API_BASE = 'http://localhost:3000';
    const payload: Record<string, any> = {};
    if (data instanceof FormData) {
      data.forEach((v, k) => { payload[k] = v; });
    } else Object.assign(payload, data);

    (async () => {
      try {
        // Normalizaciones y validaciones client-side antes de enviar
        if (!payload.name && payload.fullName) payload.name = payload.fullName;
        if (!payload.dateOfBirth && payload.birthdate) payload.dateOfBirth = payload.birthdate;
        if (!payload.trainingLv && payload.trainingLevel) payload.trainingLv = payload.trainingLevel;

        if (payload.age != null) payload.age = Number(payload.age);
        if (payload.trainingLv != null) payload.trainingLv = Number(payload.trainingLv);

        // mapear label (español) o valor antiguo a la clave del enum que espera el backend
        const statusRaw = payload.status;
        if (statusRaw) {
          const found = APPRENTICE_STATUS_OPTIONS.find(o => o.value === statusRaw || o.label === statusRaw || String(o.value) === String(statusRaw));
          if (found) payload.status = found.value;
        }

        // Asegurar fecha en ISO
        if (payload.dateOfBirth) {
          try {
            const d = new Date(payload.dateOfBirth);
            if (!isNaN(d.getTime())) payload.dateOfBirth = d.toISOString();
          } catch (e) { /* ignore */ }
        }

        // Validar que la edad coincida con la fecha de nacimiento si ambos están presentes
        if (payload.dateOfBirth && payload.age != null) {
          try {
            const bd = new Date(payload.dateOfBirth);
            if (!isNaN(bd.getTime())) {
              const today = new Date();
              let years = today.getFullYear() - bd.getFullYear();
              const m = today.getMonth() - bd.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) years -= 1;
              if (Number(payload.age) !== years) {
                alert(`La edad (${payload.age}) no coincide con la fecha de nacimiento (${bd.toLocaleDateString()}). Edad calculada: ${years}`);
                return;
              }
            }
          } catch (e) { /* ignore parse errors */ }
        }

        // validar status contra las claves del enum
        const allowed = (APPRENTICE_STATUS as readonly string[]).map(s => String(s));
        if (!payload.status || !allowed.includes(String(payload.status))) {
          console.debug('[Apprentice] status inválido o ausente:', payload.status, 'allowed:', allowed);
          alert(`Estado inválido: "${payload.status}". Opciones válidas: ${allowed.join(', ')}`);
          return;
        }

        if (import.meta.env.MODE === 'development') console.debug('[Apprentice] payload enviado:', payload);

        const token = localStorage.getItem('token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Endpoint para crear aprendiz: POST /api/apprentice/
        const res = await fetch(`${API_BASE}/api/apprentice/`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          // intentar leer JSON o texto crudo para dar feedback útil
          let msg = 'Error al crear aprendiz';
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
        alert('Aprendiz creado correctamente');
      } catch (err) {
        console.error('Error creando aprendiz:', err);
        alert(err instanceof Error ? err.message : 'Error de red');
      }
    })();
  };
 const [collapsed,setCollapsed] = useState(false)
  return (
    <div className='listApprenticeSideBar'>
      <Sidebar collapsed={collapsed} role={user?.role || 'admin'}/>
      <div className='listApprenticeNavBar'>
        <div className='agency-header'>
          <Header title='Aprendices' description='Usa este formulario para crear o editar registros' showlogo={false} collapsed={collapsed} setCollapsed={setCollapsed}/>
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
