import { Role } from '../../domain/entities/Role';

export interface UpdateUserProfileDto {
  userId: number;
  username: string;
  email: string;
  password: string;
  role: Role;
}