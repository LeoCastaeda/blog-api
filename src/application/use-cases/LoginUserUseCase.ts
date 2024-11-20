import { LoginUserDto } from '../dtos/login-user.dto';
import { UserService } from '../services/userService';

export class LoginUser {
  constructor(private userService: UserService) {}

  async execute(dto: LoginUserDto) {
    const { email, password } = dto;
    return this.userService.loginUser(email, password);
  }
}