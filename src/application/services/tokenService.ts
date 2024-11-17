import { ITokenService } from "./ITokenService";
import jwt, { JwtPayload } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'defaultSecret';

class TokenService implements ITokenService {
  generateToken(payload: object): string {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
  }

  verifyToken(token: string): object | null {
    try {
      const decoded = jwt.verify(token, secret);
      // Verificamos que decoded sea un objeto (JwtPayload)
      return typeof decoded === 'object' ? decoded : null;
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();
