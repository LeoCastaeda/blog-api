import { UpdateUserProfileDto } from '../dtos/update-user-profile.dto';
import { UserService } from '../services/userService';
import { Role } from '../../domain/entities/Role';

export class UpdateUserProfileUseCase {
  constructor(private userService: UserService) {}

  async execute(dto: UpdateUserProfileDto) {
    // Extrae propiedades del DTO, asignando valores por defecto si están indefinidas
    const {
      userId,
      username = 'defaultUsername',
      email = 'defaultEmail@example.com',
      password = 'defaultPassword',
      role = Role.Admin, 
    } = dto;

    // Llama al servicio con los valores procesados
    return this.userService.updateUserProfile(userId, { username, email, password, role});
  }
}
