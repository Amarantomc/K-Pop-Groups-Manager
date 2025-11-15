import "../../styles/form.css"
import React from "react";
import type { Field } from "../../formSource";

type FormProps = {
    fields?: Field[];
    entity?: string;
    onSubmit?: (data: FormData | Record<string, any>) => void;
    initialValues?: Record<string, any>;
    mode?: 'add' | 'edit';
    submitLabel?: string;
};

const Form: React.FC<FormProps> = ({ fields, entity, onSubmit, initialValues = {}, mode = 'add', submitLabel }) => {
    const validateValue = (f: Field, raw: any): { ok: boolean; msg?: string } => {
        // normalize value
        if (raw instanceof File) {
            // file input
            if (f.required && (!raw || raw.size === 0)) return { ok: false, msg: `${f.label || f.name} es requerido` };
            if (f.maxFileSizeMB && raw && raw.size) {
                const mb = raw.size / (1024 * 1024);
                if (mb > f.maxFileSizeMB) return { ok: false, msg: `${f.label || f.name} supera el tamaño máximo (${f.maxFileSizeMB} MB)` };
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
            if (typeof f.min === 'number' && n < f.min) return { ok: false, msg: `${f.label || f.name} debe ser ≥ ${f.min}` };
            if (typeof f.max === 'number' && n > f.max) return { ok: false, msg: `${f.label || f.name} debe ser ≤ ${f.max}` };
        }

        if ((f.minLength || f.maxLength) && s.length) {
            if (f.minLength && s.length < f.minLength) return { ok: false, msg: `${f.label || f.name} debe tener al menos ${f.minLength} caracteres` };
            if (f.maxLength && s.length > f.maxLength) return { ok: false, msg: `${f.label || f.name} debe tener como máximo ${f.maxLength} caracteres` };
        }

        if (f.pattern && s.length) {
            try {
                const re = new RegExp(f.pattern);
                if (!re.test(s)) return { ok: false, msg: `${f.label || f.name} no cumple el formato requerido` };
            } catch (e) { /* ignore invalid pattern */ }
        }

        if (f.type === 'date' && s.length) {
            // Disallow future dates (la fecha no puede ser posterior a hoy)
            // s expected in YYYY-MM-DD or a parseable date string
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

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        // If fields are provided, validate against them
        if (fields && fields.length) {
            const fdCheck = new FormData(e.currentTarget);
            for (const f of fields) {
                // skip label-less hidden generated fields? still validate if required
                const raw = fdCheck.get(f.name);
                // If file input, get the File object
                let value = raw;
                if (f.type === 'file') {
                    const el = e.currentTarget.elements.namedItem(f.name) as HTMLInputElement | null;
                    if (el && el.files && el.files[0]) value = el.files[0];
                }
                const res = validateValue(f, value);
                if (!res.ok) {
                    alert(res.msg || 'Valor inválido');
                    // try focus the offending field
                    try { const el = e.currentTarget.elements.namedItem(f.name) as HTMLElement | null; if (el && typeof (el as any).focus === 'function') (el as any).focus(); } catch(e) {}
                    return;
                }
            }
        }

        const fd = new FormData(e.currentTarget);
        if (onSubmit) {
            onSubmit(fd);
        } else {
            const obj: Record<string, any> = {};
            fd.forEach((v, k) => { obj[k] = v; });
            console.log(`Submit ${entity ?? 'form'}`, obj);
        }
        e.currentTarget.reset();
    };

    // Retrocompatibilidad: si no vienen fields, renderizar el formulario sencillo anterior
    if (!fields) {
        return (
            <div className="Form">
                <h1>Formulario</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" placeholder="Nombre" id="name" name="name" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input type="email" placeholder="Correo Electrónico" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Mensaje</label>
                        <textarea placeholder="Mensaje" id="message" name="message" required></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="file">Adjuntar archivo</label>
                        <div className="file-input-wrapper">
                            <input type="file" id="file" name="file" />
                            <label className="file-btn" htmlFor="file">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <path d="M3 7C3 5.89543 3.89543 5 5 5H9L11 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M3 7H21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span>Examinar</span>
                            </label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="terms">
                            <input type="checkbox" id="terms" name="terms" required />
                            Acepto los términos y condiciones
                        </label>
                    </div>
                    <button type="submit" className="btn-primary">Enviar</button>
                </form>
            </div>
        )
    }

    const heading = entity ? (mode === 'edit' ? `Editar ${entity}` : `Añadir ${entity}`) : 'Formulario';

    return (
        <div className="Form">
                <h1>{heading}</h1>
                <form onSubmit={handleSubmit}>
                {fields.map((f) => {
                    const key = f.id;
                    switch (f.type) {
                        case 'text':
                        case 'email':
                        case 'password':
                        case 'number':
                        case 'date':
                        case 'time':
                            // For edit mode, populate defaultValue from initialValues when provided.
                            // Do not prefill password fields for security unless explicitly provided in initialValues.
                            const value = initialValues?.[f.name];
                            const inputProps: any = {
                                id: key,
                                name: f.name,
                                type: f.type,
                                placeholder: f.placeholder,
                                required: !!f.required,
                                min: f.min,
                                max: f.max,
                                minLength: f.minLength,
                                maxLength: f.maxLength,
                            };
                            if (f.type !== 'password' && typeof value !== 'undefined') {
                                inputProps.defaultValue = value;
                            }
                            return (
                                <div className="form-group" key={key}>
                                    <label htmlFor={key}>{f.label}</label>
                                    <input {...inputProps} />
                                </div>
                            );
                        case 'textarea':
                            return (
                                <div className="form-group" key={key}>
                                    <label htmlFor={key}>{f.label}</label>
                                    <textarea id={key} name={f.name} placeholder={f.placeholder} required={!!f.required} maxLength={f.maxLength} defaultValue={initialValues?.[f.name] ?? ''}></textarea>
                                </div>
                            );
                        case 'select':
                            return (
                                <div className="form-group" key={key}>
                                    <label htmlFor={key}>{f.label}</label>
                                    <select id={key} name={f.name} required={!!f.required} defaultValue={initialValues?.[f.name] ?? ''}>
                                        <option value="">-- Seleccionar --</option>
                                        {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            );
                        case 'file':
                            return (
                                <div className="form-group" key={key}>
                                    <label htmlFor={key}>{f.label}</label>
                                    <div className="file-input-wrapper">
                                        <input id={key} name={f.name} type="file" accept={f.accept} />
                                        <label className="file-btn" htmlFor={key}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                                <path d="M3 7C3 5.89543 3.89543 5 5 5H9L11 7H19C20.1046 7 21 7.89543 21 9V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M3 7H21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            <span>Examinar</span>
                                        </label>
                                    </div>
                                </div>
                            );
                        case 'checkbox':
                            return (
                                <div className="form-group" key={key}>
                                    <label htmlFor={key}><input id={key} name={f.name} type="checkbox" defaultChecked={!!initialValues?.[f.name]} /> {f.label}</label>
                                </div>
                            );
                        default:
                            return null;
                    }
                })}
                <button type="submit" className="btn-primary">{submitLabel ?? (mode === 'edit' ? 'Guardar' : 'Enviar')}</button>
            </form>
        </div>
    )
}

export default Form