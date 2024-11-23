import { Request, Response } from 'express';

export interface IAuthController {
  registrar(req: Request, res: Response): Promise<void>;
  iniciarSesion(req: Request, res: Response): Promise<void>;
  cerrarSesion(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
}
