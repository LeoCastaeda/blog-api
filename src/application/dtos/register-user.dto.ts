import { Role } from '../../domain/entities/Role';

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  role: Role;
}