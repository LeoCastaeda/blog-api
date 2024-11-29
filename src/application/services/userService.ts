import bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Role, UserProps } from '../../domain/entities/User';


export class UserService {
  constructor(private userRepository: IUserRepository) {}

  // Crear un nuevo usuario

  // Obtener todos los usuarios
  async getAllUsers() {
    return this.userRepository.findAll();
  }

  // Obtener un usuario por su ID
  async findById(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  // Actualizar el perfil del usuario
  async updateUserProfile(userId: number, username: string, email: string, password: string, role: Role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updates: Partial<UserProps> = { username, email, password: hashedPassword, role };
    return this.updateUserData(userId, updates);
  }

  // Actualizar los datos del usuario
  async updateUserData(userId: number, newData: Partial<UserProps>) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.update(user, newData);
  }

  // Actualizar datos específicos
  async updateUser(userId: number, updates: Partial<UserProps>) {
    return this.updateUserData(userId, updates);
  }

  // Actualizar el correo del usuario
  async updateUserEmail(userId: number, newEmail: string) {
    return this.userRepository.updateEmail(userId, newEmail);
  }

  // Banear un usuario
  async banUser(userId: number, p0: { banned: boolean; }) {
    return this.userRepository.banUser(userId);
  }

  // Desbanear un usuario
  async unbanUser(userId: number) {
    return this.userRepository.unbanUser(userId);
  }

  // Eliminar un usuario
  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.delete(userId);
  }
}
