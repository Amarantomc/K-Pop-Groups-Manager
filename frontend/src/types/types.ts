
export type UserRole = 'admin' | 'manager' | 'artist' | 'apprentice' | 'director';

// ProfileData contiene los IDs importantes según el rol del usuario
export interface ProfileData {
  apprenticeId?: string;  // Para rol apprentice y artist
  artistId?: string;      // Para rol artist
  groupId?: string;       // Para rol artist (si pertenece a un grupo)
  agencyId?: string;      // Para todos excepto admin
}

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
  profileData?: ProfileData;         // Datos del perfil según el rol
}

export interface RoleConfig {
  dashboard: string;
  allowedRoutes: string[];
  sidebarItems: string[];
  defaultRedirect: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  role: UserRole;
  profileData?: ProfileData;
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