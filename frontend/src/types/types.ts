// Ubicación: src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  // Opcionales adicionales usados en UI
  avatarUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  country?: string | null;
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

// Frontend models for Hito 1
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