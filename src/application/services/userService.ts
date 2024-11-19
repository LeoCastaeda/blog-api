import bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, Role, UserProps } from '../../domain/entities/User';
import tokenService from './tokenService';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async createUser(username: string, email: string, password: string, role: Role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create(username, email, hashedPassword, role);
    const createdUser = await this.userRepository.create(user);
    const token = tokenService.generateToken({ id: createdUser.id, role: createdUser.role });
    return { user: createdUser, token };
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = tokenService.generateToken({ id: user.id, role: user.role });
      return { user, token };
    }
    throw new Error('Invalid email or password');
  }

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async findById(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUserProfile(userId: number, username: string, email: string, password: string, role: Role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updates: Partial<UserProps> = { username, email, password: hashedPassword, role };
    return this.updateUserData(userId, updates);
  }

  async updateUserData(userId: number, newData: Partial<UserProps>) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    const updates: Partial<UserProps> = {};

    for (const key in newData) {
        const typedKey = key as keyof UserProps;
        const value = newData[typedKey];

        if (value !== undefined) {
            (updates as any)[typedKey] = value;
        }
    }

    return this.userRepository.update(user, updates);
}
  async updateUserEmail(userId: number, newEmail: string) {
    return this.userRepository.updateEmail(userId, newEmail);
  }

  async banUser(userId: number) {
    return this.userRepository.banUser(userId);
  }

  async unbanUser(userId: number) {
    return this.userRepository.unbanUser(userId);
  }

  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.delete(userId);
  }
}
