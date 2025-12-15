/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Field } from "../../config/formSource"
import { formFieldsByEntity } from "../../config/formSource"
import "./modal.css"

interface ModalCreateProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  createEntity?: string
  createFields?: Field[]
  onSave?: (data: any) => void
  onFieldChange?: (fieldName: string, value: any) => void
}

const ModalCreate: React.FC<ModalCreateProps> = ({ isOpen, onClose, title, createEntity, createFields, onSave, onFieldChange }) => {
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({})

  useEffect(() => {
    if (!isOpen) return

    // Obtener campos desde createFields o formFieldsByEntity[createEntity]
    const fields = createFields ?? (createEntity ? formFieldsByEntity[createEntity] : undefined)
    console.log('[ModalCreate] Campos recibidos para el modal:', fields);
    if (!fields || !Array.isArray(fields)) {
      setFormData({})
      setErrors({})
      setDynamicOptions({})
      return
    }

    // Inicializar formData con campos vacíos
    const emptyData: any = {}
    fields.forEach((f) => {
      const key = (f as any).name ?? (f as any).id
      if (key) {
        emptyData[key] = f.type === 'checkbox' ? false : ''
      }
    })
    setFormData(emptyData)
    setErrors({})
    setDynamicOptions({})
    console.log('[ModalCreate] formData inicializado:', emptyData);
  }, [isOpen, createEntity, createFields])

  // Efecto para cargar opciones dinámicas de selects con optionsEndpoint
  useEffect(() => {
    if (!isOpen) return;
    const fields = createFields ?? (createEntity ? formFieldsByEntity[createEntity] : undefined);
    if (!fields || !Array.isArray(fields)) return;

    fields.forEach(async (f) => {
      if (f.type === 'select' && (f as any).optionsEndpoint) {
        const endpoint = (f as any).optionsEndpoint;
        try {
          const headers: Record<string, string> = {};
          const token = localStorage.getItem('token');
          if (token) headers['Authorization'] = `Bearer ${token}`;

          // Lógica especial para el campo username de artista: join artistas + aprendices
          if ((f.name === 'username' || f.id === 'username') && (createEntity === 'user' || createEntity === 'User')) {
                        console.log('[ModalCreate] Cargando opciones para username según rol:', formData['role'] || formData['rol'] || '');
            // Detectar si el rol seleccionado es artista o aprendiz
            const roleValue = formData['role'] || formData['rol'] || '';
            const roleNorm = String(roleValue).toLowerCase();
            if (roleNorm === 'artist' || roleNorm === 'artista') {
                            console.log('[ModalCreate] Rol artista detectado, obteniendo artistas para select...');
              // Traer solo artistas y usar realName como value y label
              const resArtist = await fetch('http://localhost:3000/api/artist', { headers });
              const dataArtist = await resArtist.json();
              const artists = dataArtist.data || dataArtist;
              const options = artists
                .filter((a: any) => a.realName && a.realName.trim() !== '')
                .map((a: any) => ({ value: a.realName, label: a.realName }));
              setDynamicOptions(prev => ({ ...prev, [f.name || f.id]: options }));
              return;
            } else if (roleNorm === 'apprentice' || roleNorm === 'aprendiz') {
              // Traer solo aprendices y usar id como value y name como label
              const resApprentice = await fetch('http://localhost:3000/api/apprentice', { headers });
              const dataApprentice = await resApprentice.json();
              const apprentices = dataApprentice.data || dataApprentice;
                const options = apprentices
                .filter((a: any) => a.name && a.name.trim() !== '')
                .filter((a: any) => a.id && a.name && a.name.trim() !== '')
                .map((a: any) => ({ value: a.name, label: a.name }));
              setDynamicOptions(prev => ({ ...prev, [f.name || f.id]: options }));
              return;
            }
          }

          // Lógica normal para otros selects
          const res = await fetch(endpoint, { headers });
          const raw = await res.text();
          let data: any = [];
          try {
            data = JSON.parse(raw);
          } catch (e) {
            console.error('[ModalCreate] Error parseando JSON para', f.name || f.id, e, raw);
            return;
          }
          // Si la respuesta es { success, data: [...] }, usar data
          const arr = Array.isArray(data)
            ? data
            : (Array.isArray(data.data) ? data.data : []);
          const options = arr.map((item: any) => ({ value: item.id, label: item.name || item.fullName || item.nombre || item.label || item.id }));
          setDynamicOptions(prev => ({ ...prev, [f.name || f.id]: options }));
        } catch (err) {
          console.error('[ModalCreate] Error cargando opciones para', f.name || f.id, err);
        }
      }
    });
  }, [isOpen, createEntity, createFields, formData]);

  if (!isOpen) return null

  const handleFieldChange = (key: string, value: any) => {

    let updatedFormData = { ...formData, [key]: value };

    // Si el campo es username, buscar el label en las opciones del campo actual
    if (key === 'username') {
      const roleNorm = String(formData['role'] || formData['rol'] || '').toLowerCase();
      if (roleNorm === 'apprentice' || roleNorm === 'aprendiz' || roleNorm === 'artist' || roleNorm === 'artista') {
        // Buscar opciones en dynamicOptions, en createFields o en el propio campo actual
        let options = dynamicOptions['username'] || [];
        if ((!options.length || !Array.isArray(options)) && Array.isArray(createFields)) {
          const usernameField = createFields.find(f => (f.name || f.id) === 'username');
          if (usernameField && Array.isArray(usernameField.options)) {
            options = usernameField.options;
          }
        }
        // fallback: buscar en el propio campo actual si existe
        if ((!options.length || !Array.isArray(options)) && Array.isArray(formData.options)) {
          options = formData.options;
        }
        const found = options.find((opt: any) => String(opt.value) === String(value));
        // Solo guardar el label (nombre) en name, nunca el id, tanto para aprendiz como para artista
        updatedFormData.name = found ? found.label : '';
      }
    }

    setFormData(updatedFormData);
    console.log('[ModalCreate] handleFieldChange - formData actualizado:', updatedFormData);

    if (errors[key]) {
      setErrors({ ...errors, [key]: "" })
    }

    if (onFieldChange) {
      onFieldChange(key, value)
    }
  }

  const validateValue = (f: Field, raw: any): { ok: boolean; msg?: string } => {
    // normalize value
    if (raw instanceof File) {
      // file input
      if (f.required && (!raw || raw.size === 0)) return { ok: false, msg: `${f.label || f.name} es requerido` };
      if ((f as any).maxFileSizeMB && raw && raw.size) {
        const mb = raw.size / (1024 * 1024);
        if (mb > (f as any).maxFileSizeMB) return { ok: false, msg: `${f.label || f.name} supera el tamaño máximo (${(f as any).maxFileSizeMB} MB)` };
      }
      return { ok: true };
    }
    let v = raw;
    if (v === null || typeof v === 'undefined') v = '';
    if (Array.isArray(v)) v = v.join(',');
    const s = String(v ?? '').trim();

    if (f.required && s.length === 0) return { ok: false, msg: `${f.label || f.name} es requerido y no puede estar vacío` };

    if (f.type === 'email' && s.length) {
      // simple email regex
      const re = /^\S+@\S+\.\S+$/;
      if (!re.test(s)) return { ok: false, msg: `${f.label || f.name} debe ser un correo válido` };
    }

    if (f.type === 'number' && s.length) {
      const n = Number(s);
      if (Number.isNaN(n)) return { ok: false, msg: `${f.label || f.name} debe ser un número` };
      if (typeof (f as any).min === 'number' && n < (f as any).min) return { ok: false, msg: `${f.label || f.name} debe ser ≥ ${(f as any).min}` };
      if (typeof (f as any).max === 'number' && n > (f as any).max) return { ok: false, msg: `${f.label || f.name} debe ser ≤ ${(f as any).max}` };
    }

    if (((f as any).minLength || (f as any).maxLength) && s.length) {
      if ((f as any).minLength && s.length < (f as any).minLength) return { ok: false, msg: `${f.label || f.name} debe tener al menos ${(f as any).minLength} caracteres` };
      if ((f as any).maxLength && s.length > (f as any).maxLength) return { ok: false, msg: `${f.label || f.name} debe tener como máximo ${(f as any).maxLength} caracteres` };
    }

    if ((f as any).pattern && s.length) {
      try {
        const re = new RegExp((f as any).pattern);
        if (!re.test(s)) return { ok: false, msg: `${f.label || f.name} no cumple el formato requerido` };
      } catch (e) { /* ignore invalid pattern */ }
    }

    if (f.type === 'date' && s.length) {
      // Disallow future dates (la fecha no puede ser posterior a hoy)
      const parsed = new Date(s);
      if (isNaN(parsed.getTime())) return { ok: false, msg: `${f.label || f.name} no es una fecha válida` };
      const today = new Date();
      // normalize to date-only for comparison
      parsed.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      if (parsed.getTime() > today.getTime()) return { ok: false, msg: `${f.label || f.name} no puede ser una fecha futura` };
    }

    return { ok: true };
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    const fields = createFields ?? (createEntity ? formFieldsByEntity[createEntity] : undefined)
    if (!fields || !Array.isArray(fields)) return true

    for (const f of fields) {
      const key = (f as any).name ?? (f as any).id
      const val = formData[key]
      const res = validateValue(f, val)
      if (!res.ok) {
        newErrors[key] = res.msg || 'Valor inválido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Copia del formData para manipular
    let dataToSend = { ...formData };
    console.log('[ModalCreate] handleSubmit - formData inicial:', formData);

    // Si es creación de usuario y el campo username es select, normalizar como en Users.tsx pero para aprendiz y artista
    if (createEntity === 'user' || createEntity === 'User') {
      const roleValue = dataToSend['role'] || dataToSend['rol'] || '';
      const roleNorm = String(roleValue).toLowerCase();
      console.log('[ModalCreate] handleSubmit - roleValue:', roleValue, 'roleNorm:', roleNorm);
      // Solo si existe username y es select
      if (dataToSend['username']) {
        const options = dynamicOptions['username'] || [];
        console.log('[ModalCreate] handleSubmit - dynamicOptions[username]:', options);
        const found = options.find((opt: any) => String(opt.value) === String(dataToSend['username']));
        console.log('[ModalCreate] handleSubmit - opción encontrada para username:', found);
        if (roleNorm === 'apprentice' || roleNorm === 'aprendiz') {
          if (found) {
            dataToSend['name'] = found.label;
            dataToSend['apprenticeId'] = found.value;
            console.log('[ModalCreate] handleSubmit - Asignando para aprendiz:', { name: found.label, apprenticeId: found.value });
          } else {
            // Si no se encuentra, usar el valor seleccionado (debería ser el id)
            dataToSend['apprenticeId'] = dataToSend['username'];
            dataToSend['name'] = '';
            console.log('[ModalCreate] handleSubmit - No se encontró opción, apprenticeId:', dataToSend['username']);
          }
        } else if (roleNorm === 'artist' || roleNorm === 'artista') {
          if (found) {
            dataToSend['name'] = found.label;
            dataToSend['apprenticeId'] = found.value;
            console.log('[ModalCreate] handleSubmit - Asignando para artista:', { name: found.label, apprenticeId: found.value });
          } else {
            dataToSend['apprenticeId'] = dataToSend['username'];
            console.log('[ModalCreate] handleSubmit - No se encontró opción, apprenticeId:', dataToSend['username']);
          }
        }
        // Eliminar username del payload
        delete dataToSend['username'];
        console.log('[ModalCreate] handleSubmit - dataToSend después de procesar username:', dataToSend);
      }
    }

    console.log('[ModalCreate] handleSubmit - payload final a enviar:', dataToSend);
    onSave?.(dataToSend);
  }
  const fields = createFields ?? (createEntity ? formFieldsByEntity[createEntity] : [])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          {Array.isArray(fields) && fields.map((f) => {
            const key = (f as any).name ?? (f as any).id
            const value = formData[key]
            const errorMessage = errors[key] || ''

            if (f.type === 'textarea') {
              return (
                <div className={`form-group ${errorMessage ? 'form-group-error' : ''}`} key={key}>
                  <label htmlFor={key}>{f.label}</label>
                  <textarea
                    id={key}
                    value={value ?? ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                  {errorMessage && <span className="error-message">{errorMessage}</span>}
                </div>
              )
            }

            if (f.type === 'select') {
              // Usar opciones dinámicas si existen, si no, las del campo
              const selectOptions = dynamicOptions[f.name || f.id] || f.options || [];
              return (
                <div className={`form-group ${errorMessage ? 'form-group-error' : ''}`} key={key}>
                  <label htmlFor={key}>{f.label}</label>
                  <select
                    id={key}
                    value={value ?? ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  >
                    <option value="">-- Seleccionar --</option>
                    {selectOptions.map((o: any, idx: number) => (
                      <option key={o.value !== undefined && o.value !== null && o.value !== '' ? String(o.value) : `option-${idx}`}
                        value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {errorMessage && <span className="error-message">{errorMessage}</span>}
                </div>
              )
            }

            if (f.type === 'file') {
              return (
                <div className={`form-group ${errorMessage ? 'form-group-error' : ''}`} key={key}>
                  <label htmlFor={key}>{f.label}</label>
                  <input
                    id={key}
                    type="file"
                    accept={(f as any).accept}
                    onChange={(e) => handleFieldChange(key, (e.target as HTMLInputElement).files?.[0])}
                  />
                  {errorMessage && <span className="error-message">{errorMessage}</span>}
                </div>
              )
            }

            if (f.type === 'checkbox') {
              return (
                <div className={`form-group ${errorMessage ? 'form-group-error' : ''}`} key={key}>
                  <label htmlFor={key}>
                    <input
                      id={key}
                      type="checkbox"
                      checked={!!value}
                      onChange={(e) => handleFieldChange(key, (e.target as HTMLInputElement).checked)}
                    />
                    {' '}{f.label}
                  </label>
                  {errorMessage && <span className="error-message">{errorMessage}</span>}
                </div>
              )
            }

            // default: text / number / date
            return (
              <div className={`form-group ${errorMessage ? 'form-group-error' : ''}`} key={key}>
                <label htmlFor={key}>{f.label}</label>
                <input
                  id={key}
                  type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'}
                  value={value ?? ''}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  placeholder={f.placeholder}
                />
                {errorMessage && <span className="error-message">{errorMessage}</span>}
              </div>
            )
          })}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalCreate
