import { AuthorizeUserDto } from "../dtos/authorize-user.dto";
import { UserService } from "../services/userService";
import { Role } from "../../domain/entities/Role";

export class AuthorizeUserUseCase {
  constructor(private userService: UserService) {}

  private checkAccess(role: Role, action: string): boolean {
    const rolePermissions = {
      admin: ['viewAllUsers', 'banUser', 'eliminatePost', 'view', 'create', 'edit', 'softDelete', 'recover', 'like', 'editProfile'],
      simpleUser: ['viewOwn', 'create', 'editOwn', 'softDeleteOwn', 'like', 'view', 'editProfile'],
    };

    return rolePermissions[role]?.includes(action) || false;
  }

  async execute(dto: AuthorizeUserDto): Promise<boolean> {
    const user = await this.userService.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return this.checkAccess(dto.userRole, dto.action);
  }
}