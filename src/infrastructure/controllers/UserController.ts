import { NextFunction, Request, Response } from "express";
import { UserService } from "../../application/services/userService";
import { BanUserUseCase } from "../../application/use-cases/BanUserUseCase";
import { AuthorizeUserUseCase } from "../../application/use-cases/AuthorizeUserUseCase";
import { Role } from "../../domain/entities/Role";
import * as jwt from "jsonwebtoken";


export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly banUserUseCase: BanUserUseCase,
    private readonly authorizeUserUseCase: AuthorizeUserUseCase
  ) {}
  async authorizeUser(req: Request, res: Response, next: NextFunction): Promise<void> {
try {
  

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Malformed token" });
    return;
  }

  // Supongamos que tienes un método para decodificar el token
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: Role };
  const user = { id: decoded.id, role: decoded.role };
  console.log("Authenticated user:", user);

  if (!user.role) {
    console.log("User role is undefined:", user);
    res.status(500).json({ error: "Role undefined does not have defined permissions." });
    return;
  }

  req.user = { id: user.id, role: user.role };
  next();
} catch (error) {
  console.error("Error in authorizeUser middleware:", error);
  res.status(500).json({ error: (error as Error).message });
}
}


  // Obtener un usuario por ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(Number(id));

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Obtener todos los usuarios
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      console.log("Users retuned to controller:", users);
      res.status(200).json(users);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  // Actualizar un usuario
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { username, email, role } = req.body;

      if (!username || !email || !role) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const updatedUser = await this.userService.updateUser(Number(id), {
        username,
        email,
        role,
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  // Eliminar un usuario
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  
async banUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await this.userService.updateUser(Number(id), { banned: true });
    res.status(200).json({ message: "User banned successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

// Desbanear un usuario
async unbanUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await this.userService.updateUser(Number(id), { banned: false });
    res.status(200).json({ message: "User unbanned successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

      }

