import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { Post } from "../../domain/entities/Post";
import prisma from "../database/prismaClient";

export class PostRepository implements IPostRepository {
 

  async save(post: Post): Promise<void> {
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        createdAt: post.createdAt || new Date(),
        updatedAt: post.updatedAt || new Date(),
      },
    });
  }

 
  async findById(id: number): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    return post
      ? Post.with({
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          deleted: post.deleted || false,
        })
      : null;
  }

  
  async findAll(): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { deleted: false },
    });
    return posts.map(post =>
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

  
  async findUserPosts(userId: number, includeDeleted: boolean = false): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { 
        authorId: userId,
        ...(includeDeleted ? {} : { deleted: false })  
      },
    });
    return posts.map(post =>
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
    return post
      ? Post.with({
          id: post.id,
          title: post.title,
          content: post.content,
          authorId: post.authorId,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          deleted: post.deleted || false,
        })
      : null;
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
    } catch {
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
  async deletePermanently(id: number): Promise<void> {
    await prisma.post.delete({
      where: { id },
    });
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
      totalUsers,  
    }));
  }
}

export default PostRepository;
