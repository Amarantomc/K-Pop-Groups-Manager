// Ubicación: src/components/auth/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { LoginFormData } from '../../types/types';


const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Validación cliente: email debe ser Gmail
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
    if (!gmailRegex.test(formData.email)) {
      setError('Por favor usa una dirección Gmail válida (ej: usuario@gmail.com)');
      return;
    }

    try {
      await login(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-links">
          <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
          {/* Link to register removed per request */}
        </div>
      </div>
    </div>
  );
};

export default Login;