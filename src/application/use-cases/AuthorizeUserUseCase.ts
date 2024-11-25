import { Role } from "../../domain/entities/Role";

const permissions: Record<Role, string[]> = {
  [Role.Admin]: ["create", "read", "update", "delete"],
  [Role.SimpleUser]: ["read"],
};

interface AuthorizeUserInput {
  userId: number;
  userRole: Role;
  action: string;
}

export class AuthorizeUserUseCase {
  public execute(input: AuthorizeUserInput): boolean {
    const { userRole, action } = input;

    if (!permissions[userRole]) {
      throw new Error(`Role ${userRole} does not have defined permissions.`);
    }

    return permissions[userRole].includes(action);
  }
}

export default AuthorizeUserUseCase;

