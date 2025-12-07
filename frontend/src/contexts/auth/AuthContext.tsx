import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginFormData, UserRole } from '../../types/types';
import { isRouteAllowed } from '../../config/roles technical ';

const API_BASE = 'http://localhost:3000';

interface AuthContextType {
  user: User | null;
  login: (data: LoginFormData, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  //FUNCIONES PARA ROLES
  getUserRole: () => UserRole | null;
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  isRouteAllowed: (path: string) => boolean;
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
    const expiration = localStorage.getItem('rememberMeExpiration');

    // Si hay token y datos de usuario, restaurar la sesión
    if (token && userData) {
      // Verificar si hay Remember Me activo y si ha expirado
      if (rememberMe === 'true' && expiration) {
        const expirationDate = new Date(expiration);
        const now = new Date();
        
        if (now > expirationDate) {
          // Sesión Remember Me expirada, limpiar todo
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberMeExpiration');
          setUser(null);
          setIsLoading(false);
          return;
        }
      }
      
      // Sesión válida, restaurar usuario
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        // Error al parsear, limpiar sesión corrupta
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberMeExpiration');
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (loginData: LoginFormData, rememberMe: boolean = false): Promise<void> => {
    try {
      setIsLoading(true);
      // Inicio del proceso de login

      // Llamada real al endpoint de autenticación
      const requestBody = { email: loginData.email, password: loginData.password};

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
        // El backend retorna { success: false, error: "mensaje" }
        if (responseJson) errMsg = responseJson?.error || responseJson?.message || errMsg;
        else if (rawText) errMsg = rawText;
        throw new Error(errMsg);
      }

      // El backend retorna: { success: true, data: { user, token, expiresIn } }
      if (!responseJson?.success || !responseJson?.data) {
        throw new Error('Formato de respuesta inválido del servidor');
      }

      const { data } = responseJson;
      const token = data.token;
      let userObj = data.user;
      const roleFromBackend = userObj?.role;
      const profileData = userObj?.profileData; // profileData viene dentro de user

      console.log("USEROBJ", userObj);
      console.log("TOKEN", token);
      console.log("ROLE", roleFromBackend);
      console.log("PROFILE_DATA", profileData);

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
        // El backend devuelve role en mayúsculas/minúsculas mixtas, normalizamos a minúsculas
        const normalizedUser = {
          ...userObj,
          role: (roleFromBackend || userObj.role || 'apprentice').toLowerCase() as UserRole,
          // profileData ya viene dentro de userObj, pero lo normalizamos por si acaso
          profileData: profileData || userObj.profileData || undefined
        };
        
        // Si profileData tiene agencyId (para Manager/Director), copiarlo al nivel superior
        if (normalizedUser.profileData?.agenciaId && !normalizedUser.agencyId) {
          normalizedUser.agencyId = normalizedUser.profileData.agenciaId;
        }
        
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        
        // Guardar Remember Me si está activado
        if (rememberMe) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30); // 30 días
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberMeExpiration', expirationDate.toISOString());
        } else {
          // Limpiar remember me si no está marcado
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberMeExpiration');
        }
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

  const getUserRole = (): UserRole | null => {
    return user?.role || null;
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const isRouteAllowedForUser = (path: string): boolean => {
    if (!user) return false;
    return isRouteAllowed(path, user.role);
  };

  const value = {
  user,
  login,
  logout,
  isLoading,
  requestPasswordReset,
  verifyEmail,
  getUserRole,
  hasRole,
  hasPermission,
  isRouteAllowed: isRouteAllowedForUser, 
};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
