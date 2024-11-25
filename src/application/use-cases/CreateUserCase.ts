import { AuthService } from '../services/AuthService';
import { Role } from '../../domain/entities/User';

export class CreateUserCase {
  constructor(private authService: AuthService) {}

  async execute(username: string, email: string, password: string, role: Role) {
    return this.authService.registrar(username, email, password, role);
  }
}
