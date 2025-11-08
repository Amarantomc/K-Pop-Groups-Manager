import "../../styles/form.css"
import React from "react";

const Form : React.FC = () => {
    return (
        <div className="Form">
            <h1>Formulario</h1>
            <form>
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
                    <input type="file" id="file" name="file" />
                </div>
                <div className="form-group">
                    <label htmlFor="terms">
                        <input type="checkbox" id="terms" name="terms" required />
                        Acepto los términos y condiciones
                    </label>
                </div>
                <button type="submit">Enviar</button>
            </form>
        </div>
    )
}

export default Form