import { Request, Response } from "express";
import { AuthService } from "../../application/services/AuthService";
import { IAuthController } from "./IAuthController";

export class AuthController implements IAuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  
  async registrar(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password || !role) {
        res.status(400).json({ message: "Todos los campos son requeridos." });
        return;
      }

      const { user, token } = await this.authService.registrar(
        username,
        email,
        password,
        role
      );

      res.status(201).json({
        message: "Usuario registrado exitosamente.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  
  async iniciarSesion(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Correo y contraseña son requeridos." });
        return;
      }

      const { user, token } = await this.authService.iniciarSesion(
        email,
        password
      );

      res.status(200).json({
        message: "Inicio de sesión exitoso.",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error: any) {
      res.status(401).json({ message: "Credenciales inválidas." });
    }
  }

  
  async cerrarSesion(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(400).json({ message: "Token no proporcionado." });
        return;
      }

      await this.authService.cerrarSesion(token);

      res.status(200).json({ message: "Sesión cerrada exitosamente." });
    } catch (error: any) {
      res.status(500).json({ message: "Error al cerrar sesión." });
    }
  }

  
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({ message: "Token no proporcionado." });
        return;
      }

      const newToken = await this.authService.refrescarToken(token);

      res.status(200).json({
        message: "Token refrescado exitosamente.",
        token: newToken,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error al refrescar token." });
    }
  }
}
