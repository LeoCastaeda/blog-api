import { UserService } from '../services/userService';

export class UnbanUserUseCase {
    constructor(private userService: UserService) {}

    execute(userId: number): Promise<void> {
        return this.userService.unbanUser(userId);
    }
}