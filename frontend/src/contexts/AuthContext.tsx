
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
<<<<<<< Updated upstream
      // Simulación de API call - reemplazar con tu backend real
      const response = await mockLoginAPI(data);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
=======
      // Validación local para pruebas: user@gmail.com / password
      // Detectar modo desarrollo (soporta Vite import.meta.env.DEV y NODE_ENV)
      const isDev = !!(((import.meta as any).env && (import.meta as any).env.DEV) || process.env.NODE_ENV === 'development');

      if (isDev && data.email === 'user@gmail.com' && data.password === 'password') {
        const fakeUser: User = { id: 'local-1', name: 'Local User', email: data.email } as User;
        const fakeToken = 'local-dev-token';
        localStorage.setItem('token', fakeToken);
        localStorage.setItem('user', JSON.stringify(fakeUser));
        setUser(fakeUser);
        // Log para depuración en DEV
        try { (console as any).debug && console.debug('[AUTH DEV] Fake login ejecutado para', data.email); } catch {}
        return;
      }

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
>>>>>>> Stashed changes
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< Updated upstream
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
=======
  // register removed: user registration is handled via the Profile/add-user form elsewhere
>>>>>>> Stashed changes

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  const requestPasswordReset = async (email: string): Promise<void> => {
<<<<<<< Updated upstream
    // Simulación de API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Password reset instructions sent to ${email}`);
  };

  const verifyEmail = async (token: string): Promise<void> => {
    // Simulación de verificación de email usando el token
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Email verified successfully with token: ${token}`);
=======
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
>>>>>>> Stashed changes
  };

  const value = {
    user,
    login,
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
<<<<<<< Updated upstream

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
=======
>>>>>>> Stashed changes
