import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Role } from '../../domain/entities/Role';
import prisma from '../database/prismaClient';

function mapPrismaRoleToRole(prismaRole: string): Role {
  switch (prismaRole) {
    case 'admin':
      return Role.Admin;
    case 'simpleUser':
      return Role.User;
    default:
      throw new Error(`Unknown role: ${prismaRole}`);
  }
}
function mapRoleToPrismaRole(role: Role): string {
  return role as string;  
}
 


export class UserRepository implements IUserRepository {
  findAll(): User[] | PromiseLike<User[]> {
    throw new Error('Method not implemented.');
  }
  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? User.with({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: mapPrismaRoleToRole(user.role), // Cambiado aquí
      banned: user.banned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? User.with({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: mapPrismaRoleToRole(user.role), // Cambiado aquí
      banned: user.banned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }) : null;
  }

  async create(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        role: mapRoleToPrismaRole(user.role), // Cambiado aquí
        banned: user.banned,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
    return User.with({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      password: createdUser.password,
      role: mapPrismaRoleToRole(createdUser.role), // Cambiado aquí
      banned: createdUser.banned,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
  }

  async save(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        role: mapRoleToPrismaRole(user.role), // Cambiado aquí
        banned: user.banned,
        updatedAt: user.updatedAt,
      }
    });
  }

  async update(user: User, newData: Partial<User>): Promise<void> {
    const updateData = { ...newData };
    if (newData.role) {
      updateData.role = mapRoleToPrismaRole(newData.role);
    }
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async banUser(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { banned: true },
    });
  }

  async unbanUser(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { banned: false },
    });
  }

  async updateEmail(userId: number, newEmail: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
  }
}
