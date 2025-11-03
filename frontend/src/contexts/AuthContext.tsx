
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

  // Verificar si el usuario está autenticado al cargar la app
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
      // Simulación de API call - reemplazar con tu backend real
      const response = await mockLoginAPI(data);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    try {
      setIsLoading(true);
      // Validación: email debe ser formato Gmail
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
      if (!gmailRegex.test(data.email)) {
        throw new Error('El correo debe ser una dirección Gmail válida (ej: usuario@gmail.com)');
      }

      // Simulación de API call - reemplazar con tu backend real
      await mockRegisterAPI(data);
      
      // En una implementación real, aquí redirigirías a una página de "verifica tu email"
      alert('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    // Simulación de API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Password reset instructions sent to ${email}`);
  };

  const verifyEmail = async (token: string): Promise<void> => {
    // Simulación de verificación de email usando el token
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API functions - reemplazar con llamadas reales a tu backend
const mockLoginAPI = async (data: LoginFormData): Promise<AuthResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Rechazar correos que no sean Gmail
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRegex.test(data.email)) {
    throw new Error('El correo debe ser una dirección Gmail válida (ej: usuario@gmail.com)');
  }

  // Simulación de validación: credenciales de prueba (solo gmail)
  if (data.email === 'user@gmail.com' && data.password === 'password') {
    return {
      user: {
        id: '1',
        email: data.email,
        name: 'Test User',
        isVerified: true,
      },
      token: 'mock-jwt-token',
    };
  } else {
    throw new Error('Credenciales inválidas');
  }
};

const mockRegisterAPI = async (data: RegisterFormData): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (data.password !== data.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  // Simulación de registro exitoso
  return;
};