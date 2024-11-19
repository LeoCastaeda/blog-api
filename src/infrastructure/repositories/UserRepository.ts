import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, UserProps } from '../../domain/entities/User';
import { Role as CustomRole } from '../../domain/entities/Role';
import prisma from '../database/prismaClient';
import { Role as PrismaRole } from '@prisma/client';

// Map Prisma role to application role
function mapPrismaRoleToRole(prismaRole: PrismaRole): CustomRole {
  switch (prismaRole) {
    case PrismaRole.admin:
      return CustomRole.Admin;
    case PrismaRole.simpleUser:
      return CustomRole.User;
    default:
      throw new Error(`Unknown role: ${prismaRole}`);
  }
}

// Map application role to Prisma role
function mapRoleToPrismaRole(role: CustomRole): PrismaRole {
  switch (role) {
    case CustomRole.Admin:
      return PrismaRole.admin;
    case CustomRole.User:
      return PrismaRole.simpleUser;
    default:
      throw new Error(`Unknown role: ${role}`);
  }
}

export class UserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(user => User.with({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: mapPrismaRoleToRole(user.role),
      banned: user.banned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? User.with({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: mapPrismaRoleToRole(user.role),
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
      role: mapPrismaRoleToRole(user.role),
      banned: user.banned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { username } });
    return user ? User.with({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: mapPrismaRoleToRole(user.role),
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
        role: mapRoleToPrismaRole(user.role),
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
      role: mapPrismaRoleToRole(createdUser.role),
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
        role: mapRoleToPrismaRole(user.role),
        banned: user.banned,
        updatedAt: user.updatedAt,
      }
    });
  }

  async update(user: User, newData: Partial<UserProps>): Promise<void> {
    const updateData = {
      ...newData,
      role: newData.role ? mapRoleToPrismaRole(newData.role) : undefined,
    };

    // Filtrar campos undefined para evitar errores de Prisma
    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    );

    await prisma.user.update({
      where: { id: user.id },
      data: cleanData,
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
