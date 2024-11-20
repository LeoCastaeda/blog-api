
import { RegisterUserDto } from '../dtos/register-user.dto';
import { UserService } from '../services/userService';

export class RegisterUser {
  constructor(private userService: UserService) {}

  async execute(dto: RegisterUserDto) {
    const { username, email, password, role } = dto;
    return this.userService.createUser(username, email, password, role);
  }
}
