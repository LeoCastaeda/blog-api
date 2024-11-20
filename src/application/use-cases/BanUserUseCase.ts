import { UserService } from '../services/userService';
import { BanUserDto } from '../dtos/ban-user.dto';

export class BanUserUseCase {
  constructor(private userService: UserService) {}

  async execute(dto: BanUserDto): Promise<void> {
    return this.userService.banUser(dto.userId);
  }
}