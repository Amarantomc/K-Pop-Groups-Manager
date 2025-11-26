import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './AuthMiddleware';
import { Role } from '../../domain/enums/Role';

export class RoleMiddleware {
  static authorize(...allowedRoles: Role[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        console.log(req.user);
        if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      if (!allowedRoles.includes(req.user.role.toLowerCase() as Role)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          required: allowedRoles,
          current: req.user.role
        });
      }

      next();
    };
  }

  // Métodos auxiliares para roles específicos
  static onlyAdmin() {
    return RoleMiddleware.authorize(Role.Admin);
  }

  static onlyManager() {
    return RoleMiddleware.authorize(Role.Manager);
  }
  static onlyDirector() {
    return RoleMiddleware.authorize(Role.Director);
  }

  static onlyStaff() {
    return RoleMiddleware.authorize(Role.Admin, Role.Manager, Role.Director);
  }

  static anyAuthenticated() {
    return RoleMiddleware.authorize(
      Role.Admin, 
      Role.Artist, 
      Role.Apprentice, 
      Role.Manager, 
      Role.Director
    );
  }
}