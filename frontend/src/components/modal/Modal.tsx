/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { FieldConstraint } from "../../config/modalConstraints"
import "./modal.css"

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  data?: any
  constraints?: Record<string, FieldConstraint>
  onSave?: (data: any) => void
}

const Modal : React.FC<ModalProps> = ({ isOpen, onClose, title, data, constraints, onSave }) => {
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

    useEffect(() => {
      if (!isOpen) return

      // Si no hay constraints, usar data (o vacío)
      if (!constraints) {
        setFormData(data ?? {})
        setErrors({})
        return
      }
        // En modo editar, usar los datos proporcionados
        setFormData(data ?? {})
      
      setErrors({})
    }, [isOpen, data, constraints])

    if (!isOpen) return null

    const handleFieldChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value })

    // Clear error when user starts typing
    if (errors[key]) {
        setErrors({ ...errors, [key]: "" })
    }
}

    const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!constraints) return true

    Object.keys(constraints).forEach((key) => {
      const rule = constraints[key]
      const value = formData ? formData[key] : undefined

      // Llamar siempre a la validación personalizada si existe
      if (rule.validate) {
        const error = rule.validate(value)
        if (error) {
          newErrors[key] = error
          return
        }
      }

      // Fallback para campos required sin validate
      if (rule.required && (value === undefined || value === null || value === "")) {
        newErrors[key] = `${rule.label || key} es requerido`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
        if (onSave) {
            onSave(formData)
        }
    }
}

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
          {Object.keys(constraints || {}).map((key) => {
            const rule = (constraints || {})[key]
            if (!rule.editable) return null
            if (key === "id") return null

            const value = formData[key] ?? ""
            const errorMessage = errors[key] || ""

            if (rule.type === "select") {
              return (
                <div key={key} className={`form-group ${errorMessage ? "form-group-error" : ""}`}>
                  <label htmlFor={key}>{rule.label}</label>
                  <select
                    id={key}
                    value={value}
                    onChange={(e) => handleFieldChange(key, e.target.value)}
                  >
                    <option value="">Selecciona una opción</option>
                    {rule.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errorMessage && <span className="error-message">{errorMessage}</span>}
                </div>
              )
            }

            return (
              <div key={key} className={`form-group ${errorMessage ? "form-group-error" : ""}`}>
                <label htmlFor={key}>{rule.label}</label>
                <input
                  id={key}
                  type={rule.type === "date" ? "date" : rule.type === "number" ? "number" : "text"}
                  value={value}
                  onChange={(e) => handleFieldChange(key, e.target.value)}
                  placeholder={`Ingresa ${rule.label?.toLowerCase() || key}`}
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
                Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Modal
