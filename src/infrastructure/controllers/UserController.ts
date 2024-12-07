import { Request, Response } from "express";
import { UserService } from "../../application/services/userService";

export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Obtener todos los usuarios (solo accesible para administradores)
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const roleFromToken = (req as any).user.role; // Rol del usuario desde el token

      if (roleFromToken !== "admin") {
        res.status(403).json({ error: "Unauthorized action" });
        return;
      }

      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  }
  async findUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }
      const user = await this.userService.findById(Number(id));
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });  

    }
  }

  /**
   * Actualizar el perfil del usuario
   */
  async updateUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params; // ID del usuario a actualizar
      const userIdFromToken = (req as any).user.id; // ID del usuario autenticado
  
      
      // Validar que el ID sea numérico
      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }
  
      // Verificar que el usuario solo pueda actualizar su propio perfil
      if (userIdFromToken !== Number(id)) {
         res.status(403).json({ error: "Unauthorized action" });
        return;
      }
  
      // Extraer datos del cuerpo de la solicitud
      const { username, email, password } = req.body;
      
  
      // Validar que al menos un campo sea enviado
      if (!username && !email && !password) {
        
        res.status(400).json({ error: "No data provided for update" });
        return;
      }
  
      // Llamar al método del servicio para actualizar el perfil
      const updatedUser = await this.userService.updateUserProfile(Number(id), {
        username,
        email,
        password,
      });
  
      
  
      res.status(200).json(updatedUser);
    } catch (error) {
      
      res.status(500).json({ error: "Failed to update user profile" });
    }
  }
  
  
  /**
   * Banear un usuario (solo accesible para administradores)
   */
  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const roleFromToken = (req as any).user.role; // Rol del usuario desde el token

      if (roleFromToken !== "admin") {
        res.status(403).json({ error: "Unauthorized action" });
        return;
      }

      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      await this.userService.banUser(Number(id), true);
      res.status(200).json({ message: "User banned successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to ban user" });
    }
  }

  /**
   * Desbanear un usuario (solo accesible para administradores)
   */
  async unbanUser(req: Request, res: Response): Promise<void> {
    try {
      const roleFromToken = (req as any).user.role; // Rol del usuario desde el token

      if (roleFromToken !== "admin") {
        res.status(403).json({ error: "Unauthorized action" });
        return;
      }

      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      await this.userService.unbanUser(Number(id), false);
      res.status(200).json({ message: "User unbanned successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to unban user" });
    }
  }

  /**
   * Eliminar un usuario (solo accesible para administradores)
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const roleFromToken = (req as any).user.role; // Rol del usuario desde el token

      if (roleFromToken !== "admin") {
        res.status(403).json({ error: "Unauthorized action" });
        return;
      }

      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      await this.userService.deleteUser(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
}
