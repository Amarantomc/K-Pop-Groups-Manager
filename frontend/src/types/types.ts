
export type UserRole = 'admin' | 'manager' | 'artist' | 'apprentice' | 'director';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;                    
  agencyId?: string;                 // Para managers, artistas, aprendices
  permissions: string[];             // Permisos específicos
  avatar?: string;
  isVerified: boolean;
  avatarUrl?: string | null;
}

export interface RoleConfig {
  allowedRoutes: string[];
  sidebarItems: string[];
  defaultRedirect: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Artista {
  id: string;
  nombre: string;
  agenciaId?: string | null;
  debutYear?: number | null;
  genero?: string | null;
  fotoUrl?: string | null;
}

export interface Agencia {
  id: string;
  nombre: string;
  pais?: string | null;
  fundacionYear?: number | null;
  logoUrl?: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}