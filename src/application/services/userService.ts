import bcrypt from "bcrypt";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Role, UserProps } from "../../domain/entities/User";

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  
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

  async updateUserData(userId: number, newData: Partial<UserProps>) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const updatedUser = await this.userRepository.update(user, newData);
    return updatedUser;  
  }

   
  async banUser(userId: number, banned: boolean) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return this.userRepository.banUser(userId);
  }

   
  async unbanUser(userId: number, banned: boolean) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    return this.userRepository.unbanUser(userId);
  }

   
  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return this.userRepository.delete(userId);
  }
}
