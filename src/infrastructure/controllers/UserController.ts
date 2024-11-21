import { Request, Response } from 'express';
import { UserService } from '../../application/services/userService';
import { BanUserUseCase } from '../../application/use-cases/BanUserUseCase';
import { AuthorizeUserUseCase } from '../../application/use-cases/AuthorizeUserUseCase';
import { Role } from '../../domain/entities/Role';

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: Role };
}

export class UserController {
  constructor(
    private userService: UserService,
    private banUserUseCase: BanUserUseCase,
    private authorizeUserUseCase: AuthorizeUserUseCase
  ) {}

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
      await this.banUserUseCase.execute({ userId: Number(id) });
      res.status(200).json({ message: 'User banned successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async authorizeUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { userId, action } = req.body;
    try {
      const { user } = req;
      if (!user || !user.role) {
        throw new Error('User role is required for authorization');
      }
      const isAuthorized = await this.authorizeUserUseCase.execute({ userId, userRole: user.role, action });
      if (isAuthorized) {
        res.status(200).json({ message: 'User is authorized for this action' });
      } else {
        res.status(403).json({ error: 'User is not authorized for this action' });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}
