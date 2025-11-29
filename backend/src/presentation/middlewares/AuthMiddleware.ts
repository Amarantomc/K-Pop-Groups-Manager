import type { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import type { Role } from '../../domain/enums/Role';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    email: string;
    role: Role;

    agencyId?: number;
    apprenticeId?: number;
    groupId?: number;
  };
}

export class AuthMiddleware {
  static authenticate() {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return res.status(401).json({
            success: false,
            error: 'Token is required'
          });
        }

        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'secret'
        ) as any;

        (req as AuthenticatedRequest).user = decoded;
        next();
      } catch (error: any) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token'
        });
      }
    };
  }
}