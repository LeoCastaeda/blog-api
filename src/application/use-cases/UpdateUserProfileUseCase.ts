import { Role } from '../../domain/entities/Role';
import { UserService } from '../services/userService';

export class UpdateUserProfileUseCase {
    constructor(private userService: UserService) {}
    async execute(username: string, email: string, password: string, role: Role) {
        return this.userService.updateUserProfile(username, email, password, role);     

    }
}