import { Role } from "../domain/entities/Role";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: Role };
    }
  }
}