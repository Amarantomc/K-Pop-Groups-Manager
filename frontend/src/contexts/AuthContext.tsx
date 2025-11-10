import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginFormData } from '../types/types';

const API_BASE = 'http://localhost:3000';

interface AuthContextType {
  user: User | null;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginFormData): Promise<void> => {
    try {
      setIsLoading(true);
  // Inicio del proceso de login

      // Llamada real al endpoint de autenticación
      const requestBody = { email: data.email, password: data.password };

      if (import.meta.env.MODE === 'development') {
        // mostrar en consola petición para depuración local
        // eslint-disable-next-line no-console
        console.debug('[Auth] POST /api/auth/login ->', requestBody);
      }

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // leer texto crudo para depuración y manejo de errores no-JSON
      const rawText = await res.text();
      let responseJson: any = null;
      try {
        responseJson = rawText ? JSON.parse(rawText) : null;
      } catch (e) {
        responseJson = null;
      }

      if (import.meta.env.MODE === 'development') {
        // eslint-disable-next-line no-console
        console.debug('[Auth] response status:', res.status, res.statusText);
        // eslint-disable-next-line no-console
        console.debug('[Auth] raw response:', rawText);
        // eslint-disable-next-line no-console
        console.debug('[Auth] parsed response:', responseJson);
      }

      if (!res.ok) {
        let errMsg = 'Credenciales inválidas';
        if (responseJson) errMsg = responseJson?.message || responseJson?.error || errMsg;
        else if (rawText) errMsg = rawText;
        throw new Error(errMsg);
      }

      // aceptar varias formas de respuesta: { token, user }, { data: { token, user } }, { accessToken }
      const token = responseJson?.token || responseJson?.data?.token || responseJson?.accessToken || responseJson?.access_token;
      let userObj = responseJson?.user || responseJson?.data?.user || responseJson?.userData || null;

      // Si recibimos token pero no user, intentar obtener /api/auth/me
      if (token && !userObj) {
        try {
          const meRes = await fetch(`${API_BASE}/api/auth/me`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          });
          if (meRes.ok) {
            const meJson = await meRes.json().catch(() => null);
            if (meJson) userObj = meJson.user || meJson.data || meJson;
          }
        } catch (e) {
          // no bloquear el login por fallo en /me; se informará más abajo si falta user
          if (import.meta.env.MODE === 'development') {
            // eslint-disable-next-line no-console
            console.debug('[Auth] /api/auth/me error (ignored):', e);
          }
        }
      }

      if (!token) {
        throw new Error('Token no recibido del servidor al iniciar sesión');
      }

      // Guardar token siempre
      localStorage.setItem('token', token);

      if (userObj) {
        localStorage.setItem('user', JSON.stringify(userObj));
        setUser(userObj);
      } else {
        // Si no hay user, registrar en consola y dejar user en null (frontend puede solicitar /me cuando haga falta)
        if (import.meta.env.MODE === 'development') {
          // eslint-disable-next-line no-console
          console.debug('[Auth] login successful but no user object in response');
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // register removed: user registration is handled via the Profile/add-user form elsewhere

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  const requestPasswordReset = async (email: string): Promise<void> => {
    setIsLoading(true);
    try {
  // aqui va el endpoint
  const res = await fetch(`${API_BASE}/api/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        let errMsg = 'Error al solicitar reset de contraseña';
        try { const err = await res.json(); errMsg = err?.message || err?.error || errMsg; } catch(e) {}
        throw new Error(errMsg);
      }
      // éxito: backend normalmente envía un mensaje indicando que se envió el correo
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string): Promise<void> => {
    setIsLoading(true);
    try {
  // aqui va el endpoint
  const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        let errMsg = 'Error al verificar el email';
        try { const err = await res.json(); errMsg = err?.message || err?.error || errMsg; } catch(e) {}
        throw new Error(errMsg);
      }
      // éxito: backend suele devolver confirmación
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    requestPasswordReset,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
