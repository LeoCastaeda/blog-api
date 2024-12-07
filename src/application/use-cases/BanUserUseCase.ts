import { UserService } from '../services/userService';
import { BanUserDto } from '../dtos/ban-user.dto';
import { User } from '../../domain/entities/User';

export class BanUserUseCase {
  constructor(private userService: UserService) {}

  async execute(dto: BanUserDto): Promise<void> {
    if (dto.unban) {
      // Desbanear al usuario
      await this.userService.unbanUser(dto.userId, false);
      return;
    } else {
      // Banear al usuario
      await this.userService.banUser(dto.userId, true);
      return;

    }
  }
}
