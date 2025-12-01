import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './AuthMiddleware';
import { Role } from '../../domain/enums/Role';

export class RoleMiddleware {
  static authorize(...allowedRoles: Role[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        
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

    // Middleware específico para verificar que Manager tenga agencia
  static requireAgencyAccess(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.user?.agencyId) {
      return res.status(403).json({
        success: false,
        error: 'Agency access required'
      })
    }
    next()
  }

    // Middleware para verificar que el Manager solo acceda a su agencia
  static requireOwnAgency(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const requestedAgencyId = Number(req.params.agencyId || req.body.agencyId)
    
    if (req.user?.role === Role.Manager && req.user.agencyId !== requestedAgencyId) {
      return res.status(403).json({
        success: false,
        error: 'You can only access your own agency'
      })
    }
    
    next()
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