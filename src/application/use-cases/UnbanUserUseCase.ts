import { UnbanUserDto } from '../dtos/unban-user.dto';
import { UserService } from '../services/userService';

export class UnbanUserUseCase {
  constructor(private userService: UserService) {}

  execute(dto: UnbanUserDto): Promise<void> {
    const { userId } = dto;
    return this.userService.unbanUser(userId);
  }
}