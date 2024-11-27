export interface TokenPayload {
  id: number;
  role: string;
}

export interface ITokenService {
    generateToken(payload: TokenPayload): string;
    verifyToken(token: string): TokenPayload | null;
  }
  