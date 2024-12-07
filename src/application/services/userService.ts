import bcrypt from "bcrypt";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Role, UserProps } from "../../domain/entities/User";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Obtener todos los usuarios
   */
  async getAllUsers() {
    try {
      const users = await this.userRepository.findAll();

      if (!users || users.length === 0) {
        throw new Error("No users found");
      }

      return users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        banned: user.banned,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }));
    } catch (error) {
      console.error("Error en getAllUsers:", error instanceof Error ? error.message : error);
      throw new Error("Failed to fetch users");
    }
  }

  /**
   * Obtener un usuario por ID
   */
  async findById(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      banned: user.banned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };  
    
  }

  /**
   * Actualizar el perfil del usuario
   */
  async updateUserProfile(
    userId: number,
    { username, email, password, role }: Partial<UserProps>
  ) {
    const updates: Partial<UserProps> = { username, email, role };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    return this.updateUserData(userId, updates);
  }

  /**
   * Actualizar datos específicos del usuario
   */
  async updateUserData(userId: number, newData: Partial<UserProps>) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return this.userRepository.update(user, newData);
  }

  /**
   * Banear un usuario
   */
  async banUser(userId: number, banned: boolean) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return this.userRepository.banUser(userId);
  }

  /**
   * Desbanear un usuario
   */
  async unbanUser(userId: number, banned: boolean) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return this.userRepository.unbanUser(userId);
  }

  /**
   * Eliminar un usuario
   */
  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.userRepository.delete(userId);
  }
}
