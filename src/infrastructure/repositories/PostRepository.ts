import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { Post } from "../../domain/entities/Post";
import prisma from "../database/prismaClient";

export class PostRepository implements IPostRepository {
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.post.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findById(id: number): Promise<Post | null> {
    const post = await prisma.post.findUnique({ where: { id } });
    return post
      ? Post.with({
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          deleted: post.deleted ?? false,
        })
      : null;
  }

  async findAll(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { deleted: false },
    });
    return posts.map((post) =>
      Post.with({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        deleted: post.deleted,
      })
    );
  }

  async findByIdIncludingDeleted(id: number): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    return post ? Post.with(post) : null;
  }

  async save(post: Post): Promise<void> {
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt ?? new Date(),
        updatedAt: post.updatedAt ?? new Date(),
      },
    });
  }

  async update(post: Post): Promise<boolean> {
    try {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          title: post.title,
          content: post.content,
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async softDelete(id: number): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        deleted: true,
        updatedAt: new Date(),
      },
    });
  }

  async recover(id: number): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        deleted: false,
        updatedAt: new Date(),
      },
    });
  }

  async findUserPosts(userId: number): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { authorId: userId, deleted: false },
    });
    return posts.map((post) =>
      Post.with({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        deleted: post.deleted,
      })
    );
  }

  async findAllWithDetails(): Promise<any[]> {
    const posts = await prisma.post.findMany({
      where: { deleted: false },
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { username: true } },
        _count: { select: { likes: true } },
      },
    });
  
    const totalUsers = await prisma.user.count();
  
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author.username,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      likes: post._count.likes,
      totalUsers, // Incluye el total de usuarios para calcular la popularidad
    }));
  }
  
}
