import { Request, Response, NextFunction } from 'express';
import { Role } from '../../domain/entities/Role';  

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: Role };
}

export function authorize(roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Acceso denegado: permiso insuficiente' });
    }

    next();
  };
}
