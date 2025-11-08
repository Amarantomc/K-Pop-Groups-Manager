import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import NavBar from '../../components/navbar/Navbar'
import "../../styles/agency.css"
import { agencyFields, artistFields, apprenticeFields } from '../../formSource';
import type { Field, FieldOption } from '../../formSource';
import { useFieldOptions } from '../../hooks/useFieldOptions';


const Agency : React.FC = () =>{
  // Estado del formulario: valores por nombre de campo
  const initialState = agencyFields.reduce<Record<string, any>>((acc, f) => {
    acc[f.name] = f.type === 'file' ? null : '';
    return acc;
  }, {});

  const [values, setValues] = useState<Record<string, any>>(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const { optionsMap: hookOptionsMap, loadingMap: hookLoadingMap } = useFieldOptions(agencyFields);
  const [optionsMap, setOptionsMap] = useState<Record<string, FieldOption[]>>(hookOptionsMap ?? {});
  const [loadingMap, setLoadingOptions] = useState<Record<string, boolean>>(hookLoadingMap ?? {});
  // UI toggles para mostrar formularios
  const [showAgencyForm, setShowAgencyForm] = useState<boolean>(false);
  const [showMemberForm, setShowMemberForm] = useState<boolean>(false);
  const [memberType, setMemberType] = useState<'artist'|'apprentice'|''>('');

  // Estado y utilidades para formulario de miembro
  const memberInitial = (fields: Field[]) => fields.reduce<Record<string, any>>((acc, f) => { acc[f.name] = f.type === 'file' ? null : ''; return acc; }, {});
  const [memberValues, setMemberValues] = useState<Record<string, any>>(memberInitial(artistFields));
  const [memberErrors, setMemberErrors] = useState<Record<string,string>>({});
  const [memberMessage, setMemberMessage] = useState<string | null>(null);

  // Intento de cargar opciones dinámicas para campos que declaren `optionsEndpoint`
  useEffect(() => {
    agencyFields.forEach(field => {
      if (!field.optionsEndpoint) return;
      const endpoint = field.optionsEndpoint;
      setLoadingOptions((prev: Record<string, boolean>) => ({ ...prev, [field.name]: true }));
      fetch(endpoint)
        .then(async res => {
          if (!res.ok) throw new Error(`Status ${res.status}`);
          const body = await res.json();
          // Soporta tanto [{value,label}] como ['a','b']
          let opts: FieldOption[] = [];
          if (Array.isArray(body) && body.length > 0) {
            if (typeof body[0] === 'string') opts = (body as string[]).map(s => ({ value: s, label: String(s) }));
            else if (body[0] && typeof body[0] === 'object' && 'value' in body[0]) opts = body as FieldOption[];
          }
          setOptionsMap((prev: Record<string, FieldOption[]>) => ({ ...prev, [field.name]: opts }));
        })
        .catch(err => {
          console.warn('No se pudieron cargar opciones para', field.name, err);
          setOptionsMap((prev: Record<string, FieldOption[]>) => ({ ...prev, [field.name]: [] }));
        })
        .finally(() => setLoadingOptions((prev: Record<string, boolean>) => ({ ...prev, [field.name]: false })));
    });
  }, []);

  const handleChange = (field: Field, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (field.type === 'file') {
      const target = e.target as HTMLInputElement;
      setValues(prev => ({ ...prev, [field.name]: target.files && target.files[0] ? target.files[0] : null }));
      return;
    }

    const value = (e.target as HTMLInputElement).value;
    setValues(prev => ({ ...prev, [field.name]: value }));
  };

  const handleMemberChange = (field: Field, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (field.type === 'file') {
      const target = e.target as HTMLInputElement;
      setMemberValues(prev => ({ ...prev, [field.name]: target.files && target.files[0] ? target.files[0] : null }));
      return;
    }
    const value = (e.target as HTMLInputElement).value;
    setMemberValues(prev => ({ ...prev, [field.name]: value }));
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberMessage(null);
    const fields = memberType === 'artist' ? artistFields : apprenticeFields;
    const validationErrors: Record<string,string> = {};
    fields.forEach(field => {
      const val = memberValues[field.name];
      if (field.required) {
        if (field.type === 'file') {
          if (!val) validationErrors[field.name] = 'Este campo es obligatorio';
        } else if (String(val).trim() === '') {
          validationErrors[field.name] = 'Este campo es obligatorio';
        }
      }

      if (!validationErrors[field.name] && field.minLength && typeof val === 'string') {
        if (val.length < field.minLength) validationErrors[field.name] = `Mínimo ${field.minLength} caracteres`;
      }
      if (!validationErrors[field.name] && field.maxLength && typeof val === 'string') {
        if (val.length > field.maxLength) validationErrors[field.name] = `Máximo ${field.maxLength} caracteres`;
      }

      if (!validationErrors[field.name] && field.pattern && typeof val === 'string') {
        try {
          const re = new RegExp(field.pattern);
          if (!re.test(val)) validationErrors[field.name] = 'Formato inválido';
        } catch (err) {
          // ignore malformed regex
        }
      }

      if (!validationErrors[field.name] && field.type === 'file' && val && (field.maxFileSizeMB || field.accept)) {
        const file: File = val as File;
        if (field.maxFileSizeMB && file.size > field.maxFileSizeMB * 1024 * 1024) {
          validationErrors[field.name] = `Archivo demasiado grande (max ${field.maxFileSizeMB} MB)`;
        }
        if (field.accept && !file.type.match(field.accept.replace('*', '.*'))) {
          validationErrors[field.name] = 'Tipo de archivo no permitido';
        }
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setMemberErrors(validationErrors);
      setMemberMessage('Corrige los errores antes de enviar');
      return;
    }
    setMemberErrors({});

    try {
      const hasFile = fields.some(f => f.type === 'file');
      if (hasFile) {
        const fd = new FormData();
        Object.keys(memberValues).forEach(key => {
          const val = memberValues[key];
          if (val !== null && val !== undefined) fd.append(key, val as any);
        });
        console.log('Enviar FormData miembro:', fd);
      } else {
        console.log('Enviar JSON miembro:', memberValues);
      }
      setMemberMessage('Formulario miembro enviado (mock). Revisa la consola.');
    } catch (err) {
      console.error(err);
      setMemberMessage('Error enviando formulario miembro');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validar antes de enviar
    const validationErrors: Record<string,string> = {};
    agencyFields.forEach(field => {
      const val = values[field.name];
      if (field.required) {
        if (field.type === 'file') {
          if (!val) validationErrors[field.name] = 'Este campo es obligatorio';
        } else if (String(val).trim() === '') {
          validationErrors[field.name] = 'Este campo es obligatorio';
        }
      }

      if (!validationErrors[field.name] && field.minLength && typeof val === 'string') {
        if (val.length < field.minLength) validationErrors[field.name] = `Mínimo ${field.minLength} caracteres`;
      }
      if (!validationErrors[field.name] && field.maxLength && typeof val === 'string') {
        if (val.length > field.maxLength) validationErrors[field.name] = `Máximo ${field.maxLength} caracteres`;
      }

      if (!validationErrors[field.name] && field.pattern && typeof val === 'string') {
        try {
          const re = new RegExp(field.pattern);
          if (!re.test(val)) validationErrors[field.name] = 'Formato inválido';
        } catch (err) {
          // ignore malformed regex
        }
      }

      if (!validationErrors[field.name] && field.type === 'file' && val && (field.maxFileSizeMB || field.accept)) {
        const file: File = val as File;
        if (field.maxFileSizeMB && file.size > field.maxFileSizeMB * 1024 * 1024) {
          validationErrors[field.name] = `Archivo demasiado grande (max ${field.maxFileSizeMB} MB)`;
        }
        if (field.accept && !file.type.match(field.accept.replace('*', '.*'))) {
          validationErrors[field.name] = 'Tipo de archivo no permitido';
        }
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage('Corrige los errores antes de enviar');
      return;
    }
    setErrors({});

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
            <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <button type='button' onClick={() => { setShowAgencyForm(true); setShowMemberForm(false); setMemberType(''); }}>{'Añadir agencia'}</button>
              <button type='button' onClick={() => { setShowMemberForm(true); setShowAgencyForm(false); setMemberType(''); }}>{'Añadir miembro'}</button>
            </div>

            {showAgencyForm && (
              <form className='agency-form' onSubmit={handleSubmit}>
                {agencyFields.map(field => (
                  <div className='form-row' key={field.id} style={{ marginBottom: 12 }}>
                    <label htmlFor={field.id} style={{ display: 'block', fontWeight: 600 }}>{field.label}{field.required ? ' *' : ''}</label>
                    {field.type === 'textarea' ? (
                      <textarea id={field.id} name={field.name} placeholder={field.placeholder} value={values[field.name] || ''} onChange={(e) => handleChange(field, e as any)} />
                    ) : field.type === 'select' ? (
                      (() => {
                        const opts = optionsMap[field.name] ?? field.options ?? [];
                        const isLoading = !!loadingMap[field.name];
                        return (
                          <select id={field.id} name={field.name} value={values[field.name] || ''} onChange={(e) => handleChange(field, e as any)}>
                            <option value="">-- Selecciona --</option>
                            {isLoading ? (
                              <option value="" disabled> Cargando...</option>
                            ) : (
                              opts.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))
                            )}
                          </select>
                        );
                      })()
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
                    {errors[field.name] && <div style={{ color: 'crimson', marginTop: 6 }}>{errors[field.name]}</div>}
                  </div>
                ))}

                <div style={{ marginTop: 16 }}>
                  <button type='submit'>Guardar agencia</button>
                </div>

                {message && <p style={{ marginTop: 12 }}>{message}</p>}
              </form>
            )}

            {showMemberForm && (
              <div className='member-area'>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontWeight: 600 }}>Tipo de miembro</label>
                  <select value={memberType} onChange={(e) => {
                    const val = e.target.value as ('artist'|'apprentice'|'');
                    setMemberType(val);
                    // reset values to match selected type
                    if (val === 'artist') setMemberValues(memberInitial(artistFields));
                    else if (val === 'apprentice') setMemberValues(memberInitial(apprenticeFields));
                    else setMemberValues({});
                    setMemberErrors({});
                    setMemberMessage(null);
                  }}>
                    <option value="">-- Selecciona --</option>
                    <option value="artist">Artista</option>
                    <option value="apprentice">Aprendiz</option>
                  </select>
                </div>

                {memberType && (
                  <form className='agency-form' onSubmit={handleMemberSubmit}>
                    {(memberType === 'artist' ? artistFields : apprenticeFields).map(field => (
                      <div className='form-row' key={field.id} style={{ marginBottom: 12 }}>
                        <label htmlFor={field.id} style={{ display: 'block', fontWeight: 600 }}>{field.label}{field.required ? ' *' : ''}</label>
                        {field.type === 'textarea' ? (
                          <textarea id={field.id} name={field.name} placeholder={field.placeholder} value={memberValues[field.name] || ''} onChange={(e) => handleMemberChange(field, e as any)} />
                        ) : field.type === 'select' ? (
                          <select id={field.id} name={field.name} value={memberValues[field.name] || ''} onChange={(e) => handleMemberChange(field, e as any)}>
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
                            value={field.type === 'file' ? undefined : (memberValues[field.name] ?? '')}
                            onChange={(e) => handleMemberChange(field, e as any)}
                            min={field.min}
                            max={field.max}
                          />
                        )}
                        {memberErrors[field.name] && <div style={{ color: 'crimson', marginTop: 6 }}>{memberErrors[field.name]}</div>}
                      </div>
                    ))}

                    <div style={{ marginTop: 16 }}>
                      <button type='submit'>Guardar {memberType === 'artist' ? 'artista' : 'aprendiz'}</button>
                    </div>
                    {memberMessage && <p style={{ marginTop: 12 }}>{memberMessage}</p>}
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agency;