import { UserService } from '../services/userService';

export class BanUserUseCase {
  constructor(private userService: UserService) {}

  async execute(userId: number): Promise<void> {
    return this.userService.banUser(userId);
  }
}