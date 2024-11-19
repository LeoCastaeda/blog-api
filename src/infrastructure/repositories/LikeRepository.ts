import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { Like } from '../../domain/entities/Like';
import prisma from '../database/prismaClient';

export class LikeRepository implements ILikeRepository {
  softDelete: any;
  async findById(id: number): Promise<Like | null> {
    const like = await prisma.like.findUnique({
      where: { id },
    });
    return like ? Like.with(like) : null;
  }

  async findByUserId(userId: number): Promise<Like[]> {
    const likes = await prisma.like.findMany({
      where: { userId, deleted: false },  // Filtrar los likes eliminados
    });
    return likes.map(like => Like.with(like));
  }

  async findByPostId(postId: number): Promise<Like[]> {
    const likes = await prisma.like.findMany({
      where: { postId, deleted: false },  // Filtrar los likes eliminados
    });
    return likes.map(like => Like.with(like));
  }

  async countByPostId(postId: number): Promise<number> {
    return await prisma.like.count({
      where: { postId, deleted: false },  // Filtrar los likes eliminados
    });
  }

  async countByUserId(userId: number): Promise<number> {
    return await prisma.like.count({
      where: { userId, deleted: false },  // Filtrar los likes eliminados
    });
  }

  async save(like: Like): Promise<Like> {
    const createdLike = await prisma.like.create({
      data: {
        userId: like.userId,
        postId: like.postId,
      },
    });
    return Like.with({
      id: createdLike.id,
      userId: createdLike.userId,
      postId: createdLike.postId,
      createdAt: createdLike.createdAt,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.like.update({
      where: { id },
      data: { deleted: true },  // Soft delete
    });
  }
}
