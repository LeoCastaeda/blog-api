import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../../domain/entities/Role';

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: Role };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    res.status(401).json({ error: 'Access token missing' }); 
    return; 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    if (typeof decoded === 'object' && 'id' in decoded && 'role' in decoded) {
      req.user = { id: decoded.id, role: decoded.role as Role };
      next(); 
    } else {
      res.status(403).json({ error: 'Token does not have valid user data' }); 
    }
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' }); 
  }
};
