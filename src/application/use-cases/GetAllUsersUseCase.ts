import { UserService } from '../services/userService';
import { User } from '../../domain/entities/User';

export class GetAllUsersUseCase {
  constructor(private userService: UserService) {}

  async execute(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
}