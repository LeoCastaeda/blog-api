import { LoginUserDto } from '../dtos/login-user.dto';
import { AuthService } from '../services/AuthService';

export class LoginUser {
  constructor(private authService: AuthService) {}

  async execute(dto: LoginUserDto) {
    const { email, password } = dto;

    try {
      const user = await this.authService.iniciarSesion(email, password);
    return user;
    } catch (error) {
      throw new Error('User not found');
    }
  
  }
}