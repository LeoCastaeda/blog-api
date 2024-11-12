import bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, Role, UserProps } from '../../domain/entities/User';
import tokenService from './tokenService';

export class UserService {
  updateUserProfile(username: string, email: string, password: string, role: Role) {
      throw new Error('Method not implemented.');
  }
  getAllUsers(): User[] | PromiseLike<User[]> {
    throw new Error('Method not implemented.');
  }

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
    if (user && await bcrypt.compare(password, user.password)) {
      const token = tokenService.generateToken({ id: user.id, role: user.role });
      return { user, token };
    }
    throw new Error('Invalid email or password');
  }

  async updateUserEmail(userId: number, newEmail: string) {
    return this.userRepository.updateEmail(userId, newEmail);
  }

  async updateUserData(userId: number, newData: Partial<UserProps>) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (newData.email) {
      user.updateEmail(newData.email);
    }

    if (newData.password) {
      const hashedPassword = await bcrypt.hash(newData.password, 10);
      user.updatePassword(hashedPassword);
    }

    if (newData.username) {
      user.updateUsername(newData.username);
    }

    if (newData.role) {
      user.updateRole(newData.role);
    }

    if (newData.banned !== undefined) {
      if (newData.banned) {
        user.banUser();
      } else {
        user.unbanUser();
      }
    }

    user.updateUpdatedAt(new Date());

    // Now call the update method with both the user and the newData
    return this.userRepository.update(user, newData);
  }

  async banUser(userId: number) {
    return this.userRepository.banUser(userId);
  }

  async unbanUser(userId: number) {
    return this.userRepository.unbanUser(userId);
  }
}