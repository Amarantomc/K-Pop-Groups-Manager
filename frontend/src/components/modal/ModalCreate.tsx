/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import type { Field } from "../../config/formSource"
import { formFieldsByEntity, ROLES_GROUPS } from "../../config/formSource"
import { useAuth } from '../../contexts/auth/AuthContext';
import "./modal.css"

interface ModalCreateProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  createEntity?: string
  createFields?: Field[]
  onSave?: (data: any) => void
  onFieldChange?: (fieldName: string, value: any) => void
  user?: { agencyId: string } // Add user prop with agencyId
  clickedDate?: string
}

const ModalCreate: React.FC<ModalCreateProps> = ({ isOpen, onClose, title, createEntity, createFields, onSave, onFieldChange, clickedDate }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, any[]>>({})
  const [memberTypes, setMemberTypes] = useState<string[]>([]);
  const [memberOptions, setMemberOptions] = useState<any[][]>([]);
  const [currentRole, setCurrentRole] = useState<string>(''); // Estado separado para rastrear el rol
  const wasOpenRef = useRef(false); // Ref para detectar cuando se abre por primera vez


  useEffect(() => {
    if (!isOpen) {
      wasOpenRef.current = false;
      return;
    }

    // Solo resetear cuando se abre el modal por primera vez
    const isFirstOpen = !wasOpenRef.current;
    if (isFirstOpen) {
      wasOpenRef.current = true;
      setCurrentRole('');
    }

    // Obtener campos desde createFields o formFieldsByEntity[createEntity]
    const fields = createFields ?? (createEntity ? formFieldsByEntity[createEntity] : undefined)
    console.log('[ModalCreate] Campos recibidos para el modal:', fields);
    if (!fields || !Array.isArray(fields)) {
      if (isFirstOpen) {
        setFormData({})
        setErrors({})
        setDynamicOptions({})
      }
      return
    }

    // Solo resetear formData si es la primera vez que se abre
    // De lo contrario, preservar los valores existentes
    if (isFirstOpen) {
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
    } else {
      // Si ya estaba abierto, solo asegurarse de que los nuevos campos existan en formData
      setFormData((prevFormData: any) => {
        const updatedData: any = { ...prevFormData }
        fields.forEach((f) => {
          const key = (f as any).name ?? (f as any).id
          if (key && !(key in updatedData)) {
            // Solo agregar si el campo no existe
            updatedData[key] = f.type === 'checkbox' ? false : ''
          }
        })
        console.log('[ModalCreate] formData actualizado con nuevos campos:', updatedData);
        return updatedData
      })
    }
  }, [isOpen, createEntity, createFields])

  // Efecto especial para cargar opciones de username cuando cambia el rol en User
  useEffect(() => {
    if (!isOpen || (createEntity !== 'user' && createEntity !== 'User')) return;
    
    const roleNorm = currentRole.toLowerCase();
    console.log('[ModalCreate] Rol cambió a:', currentRole);
    
    if (!currentRole) {
      // Si no hay rol, limpiar las opciones
      console.log('[ModalCreate] Sin rol seleccionado, limpiando opciones de username');
      setDynamicOptions(prev => ({ ...prev, username: [] }));
      return;
    }

    // Verificar si ya hay opciones en createFields
    const fields = createFields ?? (createEntity ? formFieldsByEntity[createEntity] : undefined);
    const usernameField = fields?.find((f: any) => f.name === 'username' || f.id === 'username');
    
    if (usernameField && Array.isArray(usernameField.options) && usernameField.options.length > 0) {
      console.log('[ModalCreate] Opciones de username encontradas en createFields:', usernameField.options.length);
      setDynamicOptions(prev => ({ ...prev, username: usernameField.options || [] }));
      return;
    }

    // Si no hay opciones en createFields, cargar desde la API
    const headers: Record<string, string> = {};
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const loadUsernameOptions = async () => {
      try {
        if (roleNorm === 'artist' || roleNorm === 'artista') {
          console.log('[ModalCreate] Cargando artistas para username desde API...');
          const resArtist = await fetch('http://localhost:3000/api/artist', { headers });
          const dataArtist = await resArtist.json();
          const artists = dataArtist.data || dataArtist;
          const options = artists
            .filter((a: any) => a.realName && a.realName.trim() !== '')
            .map((a: any) => ({ value: a.realName, label: a.realName }));
          console.log('[ModalCreate] Opciones de artistas cargadas desde API:', options.length);
          setDynamicOptions(prev => ({ ...prev, username: options }));
        } else if (roleNorm === 'apprentice' || roleNorm === 'aprendiz') {
          console.log('[ModalCreate] Cargando aprendices para username desde API...');
          const resApprentice = await fetch('http://localhost:3000/api/apprentice', { headers });
          const dataApprentice = await resApprentice.json();
          const apprentices = dataApprentice.data || dataApprentice;
          const options = apprentices
            .filter((a: any) => a.name && a.name.trim() !== '')
            .map((a: any) => ({ value: a.name, label: a.name }));
          console.log('[ModalCreate] Opciones de aprendices cargadas desde API:', options.length);
          setDynamicOptions(prev => ({ ...prev, username: options }));
        } else {
          // Para otros roles, limpiar las opciones
          console.log('[ModalCreate] Rol sin opciones dinámicas, limpiando username');
          setDynamicOptions(prev => ({ ...prev, username: [] }));
        }
      } catch (err) {
        console.error('[ModalCreate] Error cargando opciones para username:', err);
      }
    };

    loadUsernameOptions();
  }, [currentRole, isOpen, createEntity, createFields]);

  // Efecto para cargar opciones dinámicas de selects con optionsEndpoint (excluyendo username que se maneja arriba)
  useEffect(() => {
    if (!isOpen) return;
    const fields = createFields ?? (createEntity ? formFieldsByEntity[createEntity] : undefined);
    if (!fields || !Array.isArray(fields)) return;

    fields.forEach(async (f) => {
      if (f.type === 'select' && (f as any).optionsEndpoint) {
        // Saltar el campo username que se carga en su propio efecto
        if ((f.name === 'username' || f.id === 'username') && (createEntity === 'user' || createEntity === 'User')) {
          return;
        }

        const endpoint = (f as any).optionsEndpoint;
        try {
          const headers: Record<string, string> = {};
          const token = localStorage.getItem('token');
          if (token) headers['Authorization'] = `Bearer ${token}`;

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
  }, [isOpen, createEntity, createFields]);

  if (!isOpen) return null

  const handleFieldChange = (key: string, value: any) => {

    let updatedFormData = { ...formData, [key]: value };

    // Si el campo es role y es un usuario, actualizar currentRole y limpiar el campo username
    if ((key === 'role' || key === 'rol') && (createEntity === 'user' || createEntity === 'User')) {
      console.log('[ModalCreate] Rol cambiado a:', value);
      updatedFormData.username = '';
      updatedFormData.name = '';
      // Actualizar el estado de currentRole para disparar el efecto
      setCurrentRole(String(value).trim());
    }

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

    // Si el campo responsible existe, busca el label y reemplaza el id por el label
    if (dataToSend['responsible']) {
      const options = dynamicOptions['responsible'] || [];
      const found = options.find((opt: any) => String(opt.value) === String(dataToSend['responsible']));
      if (found) {
        dataToSend['responsible'] = found.label;
        console.log('[ModalCreate] handleSubmit - Reemplazando responsible por label:', found.label);
      }
    }

    console.log('[ModalCreate] handleSubmit - payload final a enviar:', dataToSend);
    console.log('[ModalCreate] onSave callback existe?:', !!onSave);
    if (onSave) {
      console.log('[ModalCreate] Llamando a onSave...');
      onSave(dataToSend);
      console.log('[ModalCreate] onSave completado');
    } else {
      console.error('[ModalCreate] ERROR: onSave no está definido');
    }
  }

  const handleAddMember = () => {
    const members = Array.isArray(formData.members) ? formData.members : [];
    const newMembers = [...members, { type: '', memberId: '', role: '' }];
    setFormData({ ...formData, members: newMembers });
    setMemberTypes(prev => [...prev, '']);
    setMemberOptions(prev => [...prev, []]);
  };

  const handleRemoveMember = (idx: number) => {
    const members = Array.isArray(formData.members) ? formData.members : [];
    const newMembers = members.filter((_: any, i: number) => i !== idx);
    setFormData({ ...formData, members: newMembers });
    setMemberTypes(prev => prev.filter((_, i) => i !== idx));
    setMemberOptions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleTypeChange = (idx: number, type: string) => {
    setMemberTypes(prev => {
      const copy = [...prev];
      copy[idx] = type;
      return copy;
    });
    fetchMembers(type, idx);
    // Limpiar el miembro seleccionado al cambiar tipo y actualizar el tipo en el objeto miembro
    const members = Array.isArray(formData.members) ? formData.members : [];
    const newMembers = [...members];
    newMembers[idx].memberId = '';
    newMembers[idx].type = type;
    setFormData({ ...formData, members: newMembers });
  };

  const handleMemberFieldChange = (idx: number, field: string, val: string) => {
    const members = Array.isArray(formData.members) ? formData.members : [];
    const newMembers = [...members];
    newMembers[idx][field] = val;
    //newPerformers[idx].memberId = e.target.value;
    setFormData({ ...formData, members: newMembers });
  };

  const fetchMembers = async (type: string, idx: number) => {
    const endpoint = type === 'apprentice' ? '/api/application/apprentices/without-application' : '/api/application/soloistArtist';
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:3000${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    const data = await res.json();
    const arr = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
    
    // Debug: log propiedades de cada artista
    if (type === 'artist') {
      arr.forEach((item: any, i: number) => {
        console.log(`[ModalCreate] Artista ${i}:`, {
          ApprenticeId: item.ApprenticeId,
          GroupId: item.GroupId,
          id: item.id,
          name: item.name,
          realName: item.realName,
          ArtistName: item.ArtistName
        });
      });
    }
    
    const opts = arr.map((item: any) => {
      let value: string;
      if (type === 'artist') {
        // Para artistas: usar ApprenticeId (mayúscula) y GroupId (mayúscula)
        const apprenticeId = item.ApprenticeId ?? item.apprenticeId ?? item.IdAp ?? item.idAp;
        const groupId = item.GroupId ?? item.groupId ?? item.IdGr ?? item.idGr;
        value = `${apprenticeId},${groupId}`;
      } else {
        value = String(item.id ?? item.IdAp ?? item.apprenticeId ?? '');
      }
      
      return {
        value,
        label: item.realName || item.name || item.ArtistName || item.nombreArtistico || item.nombre || item.label || item.id
      };
    });
    
    console.log('[ModalCreate] fetchMembers - opciones mapeadas:', opts);
    setMemberOptions(prev => {
      const copy = [...prev];
      copy[idx] = opts;
      return copy;
    });
  };

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


            // Lógica para campo members en solicitud (request): aprendiz/artista + miembro + rol
            if (f.type === 'group' && f.name === 'members' && (createEntity === 'request' || createEntity === 'Request')) {
              const members = Array.isArray(formData.members) ? formData.members : [];
              return (
                <div className={`form-group ${errors.members ? 'form-group-error' : ''}`} key={f.name}>
                  <label htmlFor={f.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {f.label}
                    <button
                      type="button"
                      onClick={handleAddMember}
                      style={{ marginLeft: 8, fontWeight: 'bold', fontSize: 18, cursor: 'pointer', background: 'none', border: 'none', color: '#2563eb', padding: 0 }}
                      title="Agregar miembro"
                    >
                      +
                    </button>
                  </label>
                  {members.map((member: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                      {/* Tipo de miembro */}
                      <select
                        value={member.type || memberTypes[idx] || ''}
                        onChange={e => handleTypeChange(idx, e.target.value)}
                        style={{ minWidth: 110 }}
                      >
                        <option value="">Seleccione tipo</option>
                        <option value="apprentice">Aprendiz</option>
                        <option value="artist">Artista</option>
                      </select>
                      {/* Nombre del miembro */}
                      <select
                        value={member.memberId || ''}
                        onChange={e => handleMemberFieldChange(idx, 'memberId', e.target.value)}
                        style={{ minWidth: 160 }}
                      >
                        <option value="">Selecciona miembro</option>
                        {(memberOptions[idx] || []).map((opt, optIdx) => {
                          const optValue = String(opt.value || '');
                          const optKey = optValue || `opt-${optIdx}`;
                          return (
                            <option key={optKey} value={optValue}>
                              {opt.label}
                            </option>
                          );
                        })}
                      </select>
                      {/* Rol */}
                      <select
                        value={member.role}
                        onChange={e => handleMemberFieldChange(idx, 'role', e.target.value)}
                        style={{ minWidth: 120 }}
                      >
                        <option value="">Selecciona rol</option>
                        {Object.values(ROLES_GROUPS).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(idx)}
                        style={{ marginLeft: 4, fontWeight: 'bold', fontSize: 18, cursor: 'pointer', background: 'none', border: 'none', color: '#ef4444', padding: 0 }}
                        title="Eliminar miembro"
                      >
                        –
                      </button>
                    </div>
                  ))}
                  {errors.members && <span className="error-message">{errors.members}</span>}
                </div>
              );
            }

            // Lógica para campo performer en actividad: grupo/artista + miembro
            if (f.type === 'group' && f.name === 'performer' && (createEntity === 'activity' || createEntity === 'Activity')) {
              const performers = Array.isArray(formData.performer) ? formData.performer : [];
              const activityType = formData.type || '';
              const isIndividual = activityType === 'individual';
              const canAdd = !isIndividual || performers.length === 0;

              // Efecto: reiniciar performers al cambiar el tipo de actividad
              useEffect(() => {
                if (!isOpen || (createEntity !== 'activity' && createEntity !== 'Activity')) return;
                setFormData((prev: any) => ({ ...prev, performer: [] }));
                setMemberTypes([]);
                setMemberOptions([]);
              }, [formData.type]);

              return (
                <div className={`form-group ${errors.performer ? 'form-group-error' : ''}`} key={f.name}>
                  <label htmlFor={f.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {f.label}
                    <button
                      type="button"
                      onClick={() => {
                        if (!canAdd) return;
                        const newPerformers = [...performers, { type: '', memberId: '' }];
                        setFormData({ ...formData, performer: newPerformers });
                        setMemberTypes(prev => [...prev, '']);
                        setMemberOptions(prev => [...prev, []]);
                      }}
                      style={{ marginLeft: 8, fontWeight: 'bold', fontSize: 18, cursor: canAdd ? 'pointer' : 'not-allowed', background: 'none', border: 'none', color: canAdd ? '#2563eb' : '#aaa', padding: 0, opacity: canAdd ? 1 : 0.5 }}
                      title={canAdd ? 'Agregar performer' : 'Solo se permite un performer en actividades individuales'}
                      disabled={!canAdd}
                    >
                      +
                    </button>
                  </label>
                  {performers.map((performer: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                      {/* Tipo: Grupo o Artista */}
                      <select
                        value={performer.type || memberTypes[idx] || ''}
                        onChange={e => {
                          console.log('[Activity] Tipo de performer seleccionado:', e.target.value);
                          console.log('[Activity] Index del performer:', idx);
                          
                          setMemberTypes(prev => {
                            const copy = [...prev];
                            copy[idx] = e.target.value;
                            return copy;
                          });
                          // Limpiar el miembro seleccionado al cambiar tipo
                          const newPerformers = [...performers];
                          newPerformers[idx].memberId = '';
                          newPerformers[idx].type = e.target.value;
                          setFormData({ ...formData, performer: newPerformers });
                          console.log('[Activity] Performers actualizados después de cambiar tipo:', newPerformers);
                          
                          // Cargar opciones
                          const agencyId = user?.profileData?.agencyId;
                          console.log('[Activity] user', user)
                          console.log('[Activity] agencyId', agencyId);
                          console.log('[Activity] Date', clickedDate)
                          //if (!agencyId) return; // Prevent error if user or agencyId is missing
                          const performerType = e.target.value; // 'group' o 'artist'
                          const endpoint = performerType === 'group' ? `/api/agency/${agencyId}/groups` : `/api/agency/${agencyId}/artists`;
                          console.log('[Activity] Endpoint para obtener opciones:', endpoint);
                          
                          const token = localStorage.getItem('token');
                          const requestBody = { date: clickedDate };
                          console.log('[Activity] Request body que se enviará:', requestBody);
                          console.log('[Activity] URL completa del fetch:', `http://localhost:3000${endpoint}`);
                          
                          const res = fetch(`http://localhost:3000${endpoint}`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              ...(token ? { Authorization: `Bearer ${token}` } : {})
                            },
                            body: JSON.stringify(requestBody)
                          })
                            .then(res => {
                              console.log('[Activity] Response status:', res.status);
                              console.log('[Activity] Response ok:', res.ok);
                              return res.json();
                            })
                            .then(data => {
                              console.log('[Activity] Datos recibidos del servidor:', data);
                              console.log('[Activity] Tipo de data.data:', typeof data.data, 'Array.isArray:', Array.isArray(data.data));
                              const arr = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
                              console.log('[Activity] Array procesado (length:', arr.length, '):', arr);
                              
                              // Log detallado de cada grupo recibido
                              arr.forEach((item: any, index: number) => {
                                console.log(`[Activity] ===== ${performerType === 'group' ? 'Grupo' : 'Artista'} ${index} =====`);
                                console.log(`[Activity] Objeto completo:`, item);
                                console.log(`[Activity] Propiedades disponibles:`, Object.keys(item));
                                console.log(`[Activity] item.id:`, item.id);
                                console.log(`[Activity] item.name:`, item.name);
                                console.log(`[Activity] item.ApprenticeId:`, item.ApprenticeId);
                                console.log(`[Activity] item.GroupId:`, item.GroupId);
                                console.log(`[Activity] item.apprenticeId:`, item.apprenticeId);
                                console.log(`[Activity] item.groupId:`, item.groupId);
                                console.log(`[Activity] =====================`);
                              });
                              
                              const opts = arr.map((item: any) => ({
                                // Para grupos: solo el id | Para artistas: [ApprenticeId, GroupId]
                                value: performerType === 'group' 
                                  ? item.id 
                                  : [item.ApprenticeId, item.GroupId],
                                label: item.name || item.realName || item.nombre || item.label || item.id
                              }));
                              console.log('[Activity] Opciones mapeadas para el select:', opts);
                              setMemberOptions(prev => {
                                const copy = [...prev];
                                copy[idx] = opts;
                                return copy;
                              });
                            })
                            .catch(error => {
                              console.error('[Activity] Error en el fetch:', error);
                            });
                          console.log('[Activity] Fetch response:', res);
                          console.log('[Activity] Performer', performer)
                          console.log('[Activity] MemberOptions', memberOptions)
                        }}
                        style={{ minWidth: 110 }}
                      >
                        <option value="">Seleccione tipo</option>
                        <option value="group">Grupo</option>
                        <option value="artist">Artista</option>
                      </select>
                      {/* Miembro */}
                      <select
                        value={performer.memberId}
                        onChange={e => {
                          console.log('[Activity] Miembro/Grupo seleccionado:', e.target.value);
                          console.log('[Activity] Tipo de performer:', performer.type || memberTypes[idx]);
                          console.log('[Activity] Index del performer:', idx);
                          
                          const newPerformers = [...performers];
                          newPerformers[idx].memberId = e.target.value;
                          setFormData({ ...formData, performer: newPerformers });
                          
                          console.log('[Activity] Performers actualizados después de seleccionar miembro:', newPerformers);
                          console.log('[Activity] FormData completo:', { ...formData, performer: newPerformers });
                        }}
                        style={{ minWidth: 160 }}
                      >
                        <option value="">Selecciona miembro</option>
                        {(memberOptions[idx] || []).map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => {
                          const newPerformers = performers.filter((_: any, i: number) => i !== idx);
                          setFormData({ ...formData, performer: newPerformers });
                          setMemberTypes(prev => prev.filter((_, i) => i !== idx));
                          setMemberOptions(prev => prev.filter((_, i) => i !== idx));
                        }}
                        style={{ marginLeft: 4, fontWeight: 'bold', fontSize: 18, cursor: 'pointer', background: 'none', border: 'none', color: '#ef4444', padding: 0 }}
                        title="Eliminar performer"
                      >
                        –
                      </button>
                    </div>
                  ))}
                  {errors.performer && <span className="error-message">{errors.performer}</span>}
                </div>
              );
            }

            else if (f.type === 'textarea') {
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

            else if (f.type === 'select') {
              // Caso especial: campo username en formulario de usuario
              // Si el rol es Artista o Aprendiz, mostrar como select; si no, mostrar como text
              if ((f.name === 'username' || f.id === 'username') && (createEntity === 'user' || createEntity === 'User')) {
                const roleValue = formData['role'] || formData['rol'] || '';
                const roleNorm = String(roleValue).toLowerCase();
                const isSelectableRole = roleNorm === 'artist' || roleNorm === 'artista' || roleNorm === 'apprentice' || roleNorm === 'aprendiz';

                if (!isSelectableRole) {
                  // Para otros roles (Admin, Manager, Director), mostrar como input text
                  return (
                    <div className={`form-group ${errorMessage ? 'form-group-error' : ''}`} key={key}>
                      <label htmlFor={key}>{f.label}</label>
                      <input
                        id={key}
                        type="text"
                        value={value ?? ''}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder={f.placeholder || 'Ingresa un nombre de usuario'}
                      />
                      {errorMessage && <span className="error-message">{errorMessage}</span>}
                    </div>
                  );
                }

                // Para Artista y Aprendiz, mostrar como select
                // Buscar opciones en dynamicOptions usando 'username' como clave (no 'name')
                const selectOptions = dynamicOptions['username'] || dynamicOptions[f.name || f.id] || f.options || [];
                console.log('[ModalCreate] Field username:',f);
                console.log('[ModalCreate] dynamicOptions["username"]:', dynamicOptions['username']);
                console.log('[ModalCreate] f.options:', f.options);
                console.log('[ModalCreate] Opciones finales para username:', selectOptions);
                return (
                  <div className={`form-group ${errorMessage ? 'form-group-error' : ''}`} key={key}>
                    <label htmlFor={key}>{f.label}</label>
                    <select
                      id={key}
                      value={value ?? ''}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                    >
                      <option value="">-- Seleccionar --</option>
                      {selectOptions && selectOptions.map((o: any, idx: number) => (
                        <option key={o.value !== undefined && o.value !== null && o.value !== '' ? String(o.value) : `option-${idx}`}
                          value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {errorMessage && <span className="error-message">{errorMessage}</span>}
                  </div>
                );
              }

              // Para otros selects normales
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

            else if (f.type === 'file') {
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

            else if (f.type === 'checkbox') {
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