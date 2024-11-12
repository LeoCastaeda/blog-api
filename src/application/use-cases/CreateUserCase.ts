// src/application/usecases/RegisterUser.ts
import { Role } from '../../domain/entities/Role';
import { UserService } from '../services/userService';

export class RegisterUser {
  constructor(private userService: UserService) {}

  async execute(username: string, email: string, password: string, role: Role) {
    return this.userService.createUser(username, email, password, role);
  }
}

