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
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
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