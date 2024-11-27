import {Role} from "../../domain/entities/Role";

export class AuthorizeUserDto {
    userId: number;
    userRole: Role;
    action: string;


constructor(userId: number, userRole: Role, action: string) {
    this.userId = userId;
    this.userRole = userRole;
    this.action = action;
}

}