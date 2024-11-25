import { UserService } from '../services/userService';
import { UserDto } from '../dtos/user.dto';

export class GetAllUsersUseCase {
  constructor(private userService: UserService) {}

  async execute(): Promise<UserDto[]> {
    const users = await this.userService.getAllUsers();
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      banned: user.banned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt


    }));
  }
}