import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginFormData } from '../types/types';

const API_BASE = 'http://localhost:3000';

interface AuthContextType {
  user: User | null;
  login: (data: LoginFormData, rememberMe?: boolean) => Promise<void>;
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
    const rememberMe = localStorage.getItem('rememberMe');
    const rememberMeExpiration = localStorage.getItem('rememberMeExpiration');

    if (token && userData) {
      // Verificar si Remember Me está activo y no ha expirado
      if (rememberMe === 'true' && rememberMeExpiration) {
        const expirationDate = new Date(rememberMeExpiration);
        const now = new Date();
        
        if (now > expirationDate) {
          // Sesión expirada, limpiar todo
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberMeExpiration');
        } else {
          // Sesión válida
          setUser(JSON.parse(userData));
        }
      } else {
        // No hay Remember Me, cargar usuario normal
        setUser(JSON.parse(userData));
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginFormData, rememberMe: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);

      // 🧪 USUARIOS DE PRUEBA LOCALES (simulan backend)
      const testUsers: Record<string, { user: User; password: string }> = {
        'admin@test.com': {
          user: { id: '1', name: 'Admin Test', email: 'admin@test.com', role: 'admin', permissions: [], isVerified: true },
          password: 'admin123'
        },
        'manager@test.com': {
          user: { id: '2', name: 'Manager Test', email: 'manager@test.com', role: 'manager', permissions: [], isVerified: true },
          password: 'manager123'
        },
        'artist@test.com': {
          user: { id: '3', name: 'Artist Test', email: 'artist@test.com', role: 'artist', permissions: [], isVerified: true },
          password: 'artist123'
        },
        'apprentice@test.com': {
          user: { id: '4', name: 'Apprentice Test', email: 'apprentice@test.com', role: 'apprentice', permissions: [], isVerified: true },
          password: 'apprentice123'
        },
        'director@test.com': {
          user: { id: '5', name: 'Director Test', email: 'director@test.com', role: 'director', permissions: [], isVerified: true },
          password: 'director123'
        }
      };

      // Validar credenciales locales
      const testUser = testUsers[data.email];
      if (testUser && testUser.password === data.password) {
        const fakeToken = `local-token-${testUser.user.role}-${Date.now()}`;
        
        // Guardar en localStorage
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify(testUser.user));
        
        // Manejar Remember Me
        if (rememberMe) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30); // 30 días
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberMeExpiration', expirationDate.toISOString());
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberMeExpiration');
        }
        
        setUser(testUser.user);
        return;
      }

      // Si no coincide con usuarios de prueba, lanzar error
      throw new Error('Credenciales inválidas. Usuarios de prueba disponibles: admin@test.com, manager@test.com, artist@test.com, apprentice@test.com, director@test.com');

      // aqui va el endpoint (comentado para pruebas locales)
      /*
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });

      if (!res.ok) {
        let errMsg = 'Credenciales inválidas';
        try {
          const errJson = await res.json();
          errMsg = errJson?.message || errJson?.error || errMsg;
        } catch (e) {
          // ignore
        }
        throw new Error(errMsg);
      }

      const responseJson = await res.json();
      localStorage.setItem('token', responseJson.token);
      localStorage.setItem('user', JSON.stringify(responseJson.user));
      setUser(responseJson.user);
      */
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
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberMeExpiration');
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
