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

  useEffect(() => {
    if (!isOpen) return

    // Obtener campos desde createFields o formFieldsByEntity[createEntity]
    const fields = createFields ?? (createEntity ? formFieldsByEntity[createEntity] : undefined)
    if (!fields || !Array.isArray(fields)) {
      setFormData({})
      setErrors({})
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
  }, [isOpen, createEntity, createFields])

  if (!isOpen) return null

  const handleFieldChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value })

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[key]) {
      setErrors({ ...errors, [key]: "" })
    }

    // Notificar al componente padre sobre el cambio
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
      parsed.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
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
    e.preventDefault()

    if (validateForm()) {
      onSave?.(formData)
    }
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
              return (
                <div className={`form-group ${errorMessage ? 'form-group-error' : ''}`} key={key}>
                  <label htmlFor={key}>{f.label}</label>
                  <select
                    id={key}
                    value={value ?? ''}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  >
                    <option value="">-- Seleccionar --</option>
                    {f.options?.map((o) => (
                      <option key={(o as any).value} value={(o as any).value}>
                        {(o as any).label}
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
