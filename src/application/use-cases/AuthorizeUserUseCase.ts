import { Role } from "../../domain/entities/Role";
import { AuthorizeUserDto } from "../dtos/authorize-user.dto";

const permissions: Record<Role, string[]> = {
  [Role.Admin]: ["create", "read", "update", "delete"],
  [Role.SimpleUser]: ["read"],
};

export class AuthorizeUserUseCase {
  public execute(dto: AuthorizeUserDto): boolean {
    const { userRole, action } = dto;

    if (!permissions[userRole]) {
      throw new Error(`Role ${userRole} does not have defined permissions.`);
    }

    return permissions[userRole].includes(action);
  }
}

export default AuthorizeUserUseCase;
