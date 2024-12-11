import { UserService } from '../services/userService';
import { BanUserDto } from '../dtos/ban-user.dto';


export class BanUserUseCase {
  constructor(private userService: UserService) {}

  async execute(dto: BanUserDto): Promise<void> {
    if (dto.unban) {
       
      await this.userService.unbanUser(dto.userId, false);
      return;
    } else {
       
      await this.userService.banUser(dto.userId, true);
      return;

    }
  }
}
