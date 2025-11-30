import type { RoleConfig } from '../types/types';

export const ROLE_CONFIG: Record<string, RoleConfig> = {
  // ADMIN - Acceso solo a rutas de admin
  admin: {
    allowedRoutes: ['/admin/*', '/dashboard', '/profile'],
    sidebarItems: [
      'dashboard',
      'add_agency',
      'list_agencies',
      'add_apprentice',
      'list_apprentices',
      'add_artist',
      'list_artists',
      'create_group',
      'list_groups',
      'create_album',
      'list_albums',
      'create_activity',
      'list_activities',
      'create_contract',
      'list_contracts',
      'incomes',
      'requests',
      'profile',
      'list_users'
    ],
    defaultRedirect: '/admin/dashboard'
  },
  
  // DIRECTOR - Acceso solo a rutas de director
  director: {
    allowedRoutes: ['/director/*', '/dashboard', '/profile'],
    sidebarItems: [
      'dashboard',
      'list_apprentices',
      'add_artist',
      'list_artists',
      'create_group',
      'list_groups',
      'create_album',
      'list_albums',
      'create_activity',
      'list_activities',
      'create_contract',
      'list_contracts',
      'incomes',
      'requests',
      'profile'
    ],
    defaultRedirect: '/director/dashboard'
  },
  
  // MANAGER - Acceso solo a rutas de manager
  manager: {
    allowedRoutes: ['/manager/*', '/dashboard', '/profile'],
    sidebarItems: [
      'dashboard',
      'add_apprentice',
      'list_apprentices',
      'add_artist',
      'list_artists',
      'create_group',
      'list_groups',
      'create_album',
      'list_albums',
      'create_activity',
      'list_activities',
      'create_contract',
      'list_contracts',
      'incomes',
      'requests',
      'profile'
    ],
    defaultRedirect: '/manager/dashboard'
  },
  
  // ARTIST - Acceso solo a rutas de artist
  artist: {
    allowedRoutes: ['/artist/*', '/dashboard', '/profile'],
    sidebarItems: [
      'dashboard',
      'calendar',
      'my_earnings',
      'my_requests',
      'profile'
    ],
    defaultRedirect: '/artist/dashboard'
  },
  
  // APPRENTICE - Acceso solo a rutas de apprentice
  apprentice: {
    allowedRoutes: ['/apprentice/*', '/dashboard', '/profile'],
    sidebarItems: [
      'dashboard',
      'my_evaluations',
      'my_requests',
      'profile'
    ],
    defaultRedirect: '/apprentice/dashboard'
  }
};

export const getRoleConfig = (role: string): RoleConfig => {
  return ROLE_CONFIG[role] || ROLE_CONFIG.apprentice;
};

export const isRouteAllowed = (path: string, role: string): boolean => {
  const config = getRoleConfig(role);
  return config.allowedRoutes.some(allowedPath =>
    path.startsWith(allowedPath.replace('*', ''))
  );
};