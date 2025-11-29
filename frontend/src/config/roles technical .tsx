import type { RoleConfig } from '../types/types';

export const ROLE_CONFIG: Record<string, RoleConfig> = {
  admin: {
    dashboard: 'AdminDashboard',
    allowedRoutes: ['/admin/*', '/dashboard', '/profile'],
    sidebarItems: ['dashboard', 'agencies', 'users', 'reports'],
    defaultRedirect: '/admin/dashboard'
  },
  manager: {
    dashboard: 'ManagerDashboard',
    allowedRoutes: ['/manager/*', '/common/*', '/dashboard', '/profile'],
    sidebarItems: ['dashboard', 'apprentices', 'artists', 'activities', 'contracts'],
    defaultRedirect: '/manager/dashboard'
  },
  artist: {
    dashboard: 'ArtistDashboard',
    allowedRoutes: ['/artist/*', '/dashboard', '/profile'],
    sidebarItems: ['dashboard', 'my_schedule', 'my_earnings', 'my_profile'],
    defaultRedirect: '/artist/dashboard'
  },
  apprentice: {
    dashboard: 'ApprenticeDashboard',
    allowedRoutes: ['/apprentice/*', '/dashboard', '/profile'],
    sidebarItems: ['dashboard', 'my_evaluations', 'my_trainings', 'my_profile'],
    defaultRedirect: '/apprentice/dashboard'
  },
  director: {
    dashboard: 'DirectorDashboard',
    allowedRoutes: ['/director/*', '/dashboard', '/profile'],
    sidebarItems: ['dashboard', 'approve_groups', 'validate_achievements', 'reports'],
    defaultRedirect: '/director/dashboard'
  }
};

// 🎯 FUNCIÓN PARA OBTENER CONFIGURACIÓN POR ROL
export const getRoleConfig = (role: string): RoleConfig => {
  return ROLE_CONFIG[role] || ROLE_CONFIG.apprentice;
};

// 🎯 VERIFICAR SI RUTA ESTÁ PERMITIDA PARA ROL
export const isRouteAllowed = (path: string, role: string): boolean => {
  const config = getRoleConfig(role);
  return config.allowedRoutes.some(allowedPath => 
    path.startsWith(allowedPath.replace('*', ''))
  );
};