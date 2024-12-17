import { Role } from "../../domain/entities/Role";
import { AuthorizeUserDto } from "../dtos/authorize-user.dto";

const permissions: Record<Role, string[]> = {
  [Role.Admin]: ["create_post", "cerrar_sesion", "popular_post","read_post", "update_profile","update_own_post", "read_all_users", "read_user", "update_post", "delete_post", "ban_user", "unban_user", "delete_user", "recover_post","like_post","dislike_post", "delete"],
  [Role.SimpleUser]: ["create_post", "cerrar_sesion", "popular_post", "read_post", "update_own_post", "delete_post", "recover_post", "read_own_post", "update_profile","like_post","dislike_post"],
};

export class AuthorizeUserUseCase {
  public execute(dto: AuthorizeUserDto): boolean {
    const { userRole, action } = dto;

    if (!permissions[userRole]) {
      throw new Error(`Role ${userRole} does not have defined permissions.`);
    }

    if(!permissions[userRole].includes(action)){
      throw new Error(`Role ${userRole} does not have permission to ${action}.`);
    }

    return true;
  }
}