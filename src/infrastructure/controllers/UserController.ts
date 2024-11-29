import { Request, Response } from "express";
import { UserService } from "../../application/services/userService";

export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Obtener un usuario por ID.
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const user = await this.userService.findById(Number(id));

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Obtener todos los usuarios.
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Actualizar un usuario.
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { username, email, role } = req.body;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const updatedUser = await this.userService.updateUser(Number(id), { username, email, role });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Eliminar un usuario.
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      await this.userService.deleteUser(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Banear un usuario.
   */
  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      await this.userService.updateUser(Number(id), { banned: true });
      res.status(200).json({ message: "User banned successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Desbanear un usuario.
   */
  async unbanUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      await this.userService.updateUser(Number(id), { banned: false });
      res.status(200).json({ message: "User unbanned successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}


