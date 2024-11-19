import { Request, Response } from 'express';
import { UserService } from '../../application/services/userService';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role } = req.body;
      const user = await this.userService.createUser(username, email, password, role);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(Number(id));
      if (user !== null) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { username, email, role } = req.body;
      const updatedUser = await this.userService.updateUserData(Number(id), { username, email, role });
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(Number(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async banUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.banUser(Number(id));
      res.status(200).json({ message: 'User banned successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async unbanUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.userService.unbanUser(Number(id));
      res.status(200).json({ message: 'User unbanned successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateEmail(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { email } = req.body;
      await this.userService.updateUserEmail(Number(id), email);
      res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}