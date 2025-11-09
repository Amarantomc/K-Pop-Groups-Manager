import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginFormData, RegisterFormData, AuthResponse } from '../types/types';

interface AuthContextType {
  user: User | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
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
      const API_BASE = 'http://localhost:3000';
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

      const responseJson: AuthResponse = await res.json();
      localStorage.setItem('token', responseJson.token);
      localStorage.setItem('user', JSON.stringify(responseJson.user));
      setUser(responseJson.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    try {
      setIsLoading(true);
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (!gmailRegex.test(data.email)) {
        throw new Error('El correo debe ser una dirección Gmail válida (ej: usuario@gmail.com)');
      }

      await mockRegisterAPI(data);

      alert('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      throw error;

        // Llamada real al backend para crear usuario
        const API_BASE = 'http://localhost:3000';
        const res = await fetch(`${API_BASE}/api/user/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
        });

        if (!res.ok) {
          let errMsg = 'Error al registrar usuario';
          try {
            const errJson = await res.json();
            errMsg = errJson?.message || errJson?.error || errMsg;
          } catch (e) {
            // ignore
          }
          throw new Error(errMsg);
        }

        // Registro exitoso
        alert('Registro exitoso. Puedes iniciar sesión con tus credenciales.');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Password reset instructions sent to ${email}`);
  };

  const verifyEmail = async (token: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Email verified successfully with token: ${token}`);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    requestPasswordReset,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Mock API functions - reemplazar con llamadas reales a tu backend
const mockRegisterAPI = async (data: RegisterFormData): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }

  return;
};
