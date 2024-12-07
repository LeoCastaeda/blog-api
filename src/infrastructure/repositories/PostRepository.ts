import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { Post } from "../../domain/entities/Post";
import prisma from "../database/prismaClient";

export class PostRepository implements IPostRepository {
 
  /**
   * Crear un nuevo post.
   */
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

  /**
   * Buscar un post por ID.
   */
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

  /**
   * Buscar todos los posts no eliminados.
   */
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

  /**
   * Buscar posts por un usuario específico.
   */
  async findUserPosts(userId: number): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: { authorId: userId, deleted: false },
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

  /**
   * Buscar un post, incluyendo los eliminados.
   */
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

  /**
   * Actualizar un post existente.
   */
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

  /**
   * Eliminar un post de manera lógica (soft delete).
   */
  async softDelete(id: number): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        deleted: true,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Recuperar un post eliminado.
   */
  async recover(id: number): Promise<void> {
    await prisma.post.update({
      where: { id },
      data: {
        deleted: false,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Buscar todos los posts con detalles adicionales.
   */
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
      totalUsers, // Incluye total de usuarios para calcular popularidad
    }));
  }
}

export default PostRepository;
