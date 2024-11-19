import { Request, Response } from "express";
import { IAuthController } from "./IAuthController";
import { AuthService } from "../../application/services/AuthService";

export class AuthController implements IAuthController {
  constructor(private authService: AuthService) {}

  async login(req: Request, res: Response): Promise<void> {
    await this.iniciarSesion(req, res);
  }

  async register(req: Request, res: Response): Promise<void> {
    await this.registrar(req, res);
  }

  async logout(req: Request, res: Response): Promise<void> {
    await this.cerrarSesion(req, res);
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      const newToken = await this.authService.refrescarToken(token);
      res.status(200).json({ token: newToken });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Error desconocido' });
      }
    }
  }

  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role } = req.body;
      const user = await this.authService.registrar(username, email, password, role);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Error desconocido' });
      }
    }
  }

  async iniciarSesion(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      const token = await this.authService.iniciarSesion(username, password);
      res.status(200).json({ token });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Error desconocido' });
      }
    }
  }

  async cerrarSesion(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;
      await this.authService.cerrarSesion(token);
      res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Error desconocido' });
      }
    }
  }
}

export default AuthController;