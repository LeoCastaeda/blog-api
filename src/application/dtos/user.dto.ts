import { Role } from '../../domain/entities/Role';

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: Role;
}