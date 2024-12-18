import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User, UserProps } from "../../domain/entities/User";
import { Role as CustomRole } from "../../domain/entities/Role";
import prisma from "../database/prismaClient";
import { Role as PrismaRole } from "@prisma/client";

 
function mapPrismaRoleToRole(prismaRole: PrismaRole): CustomRole {
  return prismaRole === "admin" ? CustomRole.Admin : CustomRole.SimpleUser;
}

function mapRoleToPrismaRole(role: CustomRole): PrismaRole {
  return role === CustomRole.Admin ? "admin" : "simpleUser";
}

export class UserRepository implements IUserRepository {
  
  async update(user: User, newData: Partial<UserProps>): Promise<void> {
    
    const filteredData = Object.fromEntries(
      Object.entries({
        ...newData,
        role: newData.role ? mapRoleToPrismaRole(newData.role) : undefined,
      }).filter(([, value]) => value !== undefined)
    );

     
    await prisma.user.update({
      where: { id: user.id },
      
      data: filteredData,
    });
  }

   
  async updateEmail(userId: number, newEmail: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail },
    });
  }
   
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

   
  async updateUser(userId: number, newData: Partial<UserProps>): Promise<User> {
    
    const filteredData = Object.fromEntries(
      Object.entries({
        ...newData,
        role: newData.role ? mapRoleToPrismaRole(newData.role) : undefined,
      }).filter(([, value]) => value !== undefined)
    );

    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: filteredData,
    });

    
    return User.with({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      password: updatedUser.password,
      role: mapPrismaRoleToRole(updatedUser.role),
      banned: updatedUser.banned,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  }

   
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

  
  async countUsers(): Promise<number> {
    return prisma.user.count();
  }
}


export default UserRepository;
