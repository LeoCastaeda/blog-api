import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { Like } from '../../domain/entities/Like';
import prisma from '../database/prismaClient';

export class LikeRepository implements ILikeRepository {
  findById(id: number): Promise<Like | null> {
      throw new Error('Method not implemented.');
  }
  findByUserId(userId: number): Promise<Like[]> {
      throw new Error('Method not implemented.');
  }
  findByPostId(postId: number): Promise<Like[]> {
      throw new Error('Method not implemented.');
  }
  countByPostId(postId: number): Promise<number> {
      throw new Error('Method not implemented.');
  }
  countByUserId(userId: number): Promise<number> {
      throw new Error('Method not implemented.');
  }
  async save(like: Like): Promise<Like> {
    const createdLike = await prisma.like.create({ 
      data: {
        userId: like.userId,
        postId: like.postId,
        createdAt: like.createdAt,
      }
    });
    return Like.with({
      id: createdLike.id,
      userId: createdLike.userId,
      postId: createdLike.postId,
      createdAt: createdLike.createdAt,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.like.delete({ where: { id } });
  }
}