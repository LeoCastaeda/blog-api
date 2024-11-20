import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../../domain/entities/Role';

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: Role };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: number; role: Role };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};