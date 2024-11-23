import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role } = req.body;
      const user = await this.authService.registrar(username, email, password, role);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message || 'Error desconocido' });
    }
  }

  async iniciarSesion(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const token = await this.authService.iniciarSesion(username, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message || 'Error desconocido' });
    }
  }

  async cerrarSesion(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      await this.authService.cerrarSesion(token);
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message || 'Error desconocido' });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      const newToken = await this.authService.refrescarToken(token);
      res.status(200).json({ token: newToken });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message || 'Error desconocido' });
    }
  }
}
