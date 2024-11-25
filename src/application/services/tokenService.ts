import { ITokenService, TokenPayload } from "./ITokenService";
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'defaultSecret';

class TokenService implements ITokenService {
  generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }

  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, secret) as TokenPayload;
    } catch (error) {
      return null; // Retorna null si el token no es válido
    }
  }
} 
export default new TokenService();
