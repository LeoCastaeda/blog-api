import { Request, Response, NextFunction } from 'express';
import TokenService from '../../application/services/tokenService';  
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header is missing' });
    return;
  }

  const token = authHeader.split(' ')[1];   

  if (!token) {
    res.status(401).json({ error: 'Access token is missing' });
    return;
  }

  try {
    const decoded = TokenService.verifyToken(token);

    if (!decoded) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }

    if (typeof decoded !== 'object' || !('id' in decoded) || !('role' in decoded)) {
      res.status(403).json({ error: 'Invalid token payload' });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error('JWT Error:', error.message);
    } else {
      console.error('JWT Error:', error);
    }
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
