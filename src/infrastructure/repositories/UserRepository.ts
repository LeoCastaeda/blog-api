import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User, UserProps } from "../../domain/entities/User";
import { Role as CustomRole } from "../../domain/entities/Role";
import prisma from "../database/prismaClient";
import { Role as PrismaRole } from "@prisma/client";

// Mapeo de roles entre Prisma y dominio
function mapPrismaRoleToRole(prismaRole: PrismaRole): CustomRole {
  return prismaRole === "admin" ? CustomRole.Admin : CustomRole.SimpleUser;
}

function mapRoleToPrismaRole(role: CustomRole): PrismaRole {
  return role === CustomRole.Admin ? "admin" : "simpleUser";
}

export class UserRepository implements IUserRepository {
  /**
   * Crear un nuevo usuario
   */
  async create(userProps: UserProps): Promise<User> {
    const user = await prisma.user.create({
      data: {
        username: userProps.username,
        email: userProps.email,
        password: userProps.password,
        role: mapRoleToPrismaRole(userProps.role),
        banned: userProps.banned,
        createdAt: userProps.createdAt,
        updatedAt: userProps.updatedAt,
      },
    });
    return User.with({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: mapPrismaRoleToRole(user.role),
      banned: user.banned,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  /**
   * Actualizar un usuario por ID
   */
  async updateUser(userId: number, newData: Partial<UserProps>): Promise<void> {
    const updateData = {
      ...newData,
      role: newData.role ? mapRoleToPrismaRole(newData.role) : undefined,
    };

    // Filtrar campos undefined
    const filteredData = Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined)
    );

    await prisma.user.update({
      where: { id: userId },
      data: filteredData,
    });
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user
      ? User.with({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: mapPrismaRoleToRole(user.role),
          banned: user.banned,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
      : null;
  }

  /**
   * Buscar usuario por nombre de usuario
   */
  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { username } });
    return user
      ? User.with({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: mapPrismaRoleToRole(user.role),
          banned: user.banned,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
      : null;
  }

  /**
   * Guardar usuario
   */
  async save(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        email: user.email,
        password: user.password,
        role: mapRoleToPrismaRole(user.role),
        banned: user.banned,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map(user =>
      User.with({
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        role: mapPrismaRoleToRole(user.role),
        banned: user.banned,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    );
  }

  /**
   * Obtener usuario por ID
   */
  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user
      ? User.with({
          id: user.id,
          username: user.username,
          email: user.email,
          password: user.password,
          role: mapPrismaRoleToRole(user.role),
          banned: user.banned,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })
      : null;
  }

  /**
   * Eliminar un usuario
   */
  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  /**
   * Banear un usuario
   */
  async banUser(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { banned: true },
    });
  }

  /**
   * Desbanear un usuario
   */
  async unbanUser(userId: number): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { banned: false },
    });
  }

  /**
   * Contar usuarios
   */
  async countUsers(): Promise<number> {
    return prisma.user.count();
  }
  async update(user: User, newData: Partial<User>): Promise<void> {
    // Implementación de actualización usando Prisma
    const filteredData = Object.fromEntries(
      Object.entries(newData).filter(([, value]) => value !== undefined)
    );

    await prisma.user.update({
      where: { id: user.id },
      data: filteredData,
    });
  }

  async updateEmail(userId: number, newEmail: string): Promise<void> {
    // Implementación para actualizar solo el email
    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
  }
}

export default UserRepository;
