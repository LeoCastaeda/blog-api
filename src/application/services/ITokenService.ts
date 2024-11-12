export interface ITokenService {
    generateToken(payload: object): string;
    verifyToken(token: string): object | null;
  }
  