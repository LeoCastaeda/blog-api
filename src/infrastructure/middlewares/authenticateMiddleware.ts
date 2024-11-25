import { Request, Response, NextFunction } from "express";
import tokenService from "../../application/services/tokenService";

interface DecodedToken {
  id: number;
  role: string;
}

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: string };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }
  try {
    const decoded = tokenService.verifyToken(token) as unknown as DecodedToken;
    if (decoded) {
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } else {
      res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}