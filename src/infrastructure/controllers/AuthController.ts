import { Request, Response } from "express";
import { AuthService } from "../../application/services/AuthService";
import { IAuthController } from "./IAuthController";

export class AuthController implements IAuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registro de usuario
   */
  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password || !role) {
        res.status(400).json({ error: "Todos los campos son requeridos." });
        return;
      }

      const { user, token } = await this.authService.registrar(username, email, password, role);

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Inicio de sesión
   */
  async iniciarSesion(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Correo y contraseña son requeridos." });
        return;
      }

      const { user, token } = await this.authService.iniciarSesion(email, password);

      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  /**
   * Cerrar sesión (invalidar token)
   */
  async cerrarSesion(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(400).json({ error: "Token no proporcionado." });
        return;
      }

      await this.authService.cerrarSesion(token);

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: "Error al cerrar sesión." });
    }
  }

  /**
   * Refrescar token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ error: "Token no proporcionado." });
        return;
      }

      const newToken = await this.authService.refrescarToken(token);

      res.status(200).json({ token: newToken });
    } catch (error: any) {
      res.status(500).json({ error: "Error al refrescar token." });
    }
  }
}
