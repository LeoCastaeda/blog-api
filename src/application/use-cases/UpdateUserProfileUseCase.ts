import { UpdateUserProfileDto } from '../dtos/update-user-profile.dto';
import { UserService } from '../services/userService';

export class UpdateUserProfileUseCase {
  constructor(private userService: UserService) {}

  async execute(dto: UpdateUserProfileDto) {
    const { userId, username, email, password, role } = dto;
    return this.userService.updateUserProfile(userId, username, email, password, role);
  }
}