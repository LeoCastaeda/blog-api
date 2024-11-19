import { Role } from '../../domain/entities/Role';
import { UserService } from '../services/userService';

export class UpdateUserProfileUseCase {
    constructor(private userService: UserService) {}
    async execute(userId: number, username: string, email: string, password: string, role: Role) {
        return this.userService.updateUserProfile(userId,username, email, password, role);     

    }
}