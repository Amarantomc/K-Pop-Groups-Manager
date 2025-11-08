import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import NavBar from '../../components/navbar/Navbar'
import "../../styles/agency.css"
import { agencyFields } from '../../formSource';
import type { Field } from '../../formSource';


const Agency : React.FC = () =>{
  // Estado del formulario: valores por nombre de campo
  const initialState = agencyFields.reduce<Record<string, any>>((acc, f) => {
    acc[f.name] = f.type === 'file' ? null : '';
    return acc;
  }, {});

  const [values, setValues] = useState<Record<string, any>>(initialState);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (field: Field, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (field.type === 'file') {
      const target = e.target as HTMLInputElement;
      setValues(prev => ({ ...prev, [field.name]: target.files && target.files[0] ? target.files[0] : null }));
      return;
    }

    const value = (e.target as HTMLInputElement).value;
    setValues(prev => ({ ...prev, [field.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Si hay campos file, usar FormData; en caso contrario enviar JSON.
    const hasFile = agencyFields.some(f => f.type === 'file');
    try {
      if (hasFile) {
        const fd = new FormData();
        Object.keys(values).forEach(key => {
          const val = values[key];
          if (val !== null && val !== undefined) fd.append(key, val as any);
        });
        // TODO: sustituir por llamada real a la API
        console.log('Enviar FormData:', fd);
      } else {
        console.log('Enviar JSON:', values);
      }

      setMessage('Formulario enviado (mock). Revisa la consola.');
    } catch (err) {
      console.error(err);
      setMessage('Error enviando formulario');
    }
  };

  return (
    <div className='Agency-sidebar'>
      <Sidebar/>
      <div className='Agency-navbar'>
        <NavBar/>
        <div className='top'>
          <h1>Agency</h1>
        </div>

        <div className='bottom'>
          <div className='agency-form-container'>
            <form className='agency-form' onSubmit={handleSubmit}>
              {agencyFields.map(field => (
                <div className='form-row' key={field.id} style={{ marginBottom: 12 }}>
                  <label htmlFor={field.id} style={{ display: 'block', fontWeight: 600 }}>{field.label}{field.required ? ' *' : ''}</label>
                  {field.type === 'textarea' ? (
                    <textarea id={field.id} name={field.name} placeholder={field.placeholder} value={values[field.name] || ''} onChange={(e) => handleChange(field, e as any)} />
                  ) : field.type === 'select' ? (
                    <select id={field.id} name={field.name} value={values[field.name] || ''} onChange={(e) => handleChange(field, e as any)}>
                      <option value="">-- Selecciona --</option>
                      {field.options && field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      name={field.name}
                      type={field.type === 'file' ? 'file' : field.type}
                      placeholder={field.placeholder}
                      value={field.type === 'file' ? undefined : (values[field.name] ?? '')}
                      onChange={(e) => handleChange(field, e as any)}
                      min={field.min}
                      max={field.max}
                    />
                  )}
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <button type='submit'>Guardar agencia</button>
              </div>

              {message && <p style={{ marginTop: 12 }}>{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agency;