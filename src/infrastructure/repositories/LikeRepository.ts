import { ILikeRepository } from '../../domain/repositories/ILikeRepository';
import { Like } from '../../domain/entities/Like';
import prisma from '../database/prismaClient';

export class LikeRepository implements ILikeRepository {
  async findByUserIdAndPostId(userId: number, postId: number): Promise<Like | null> {
    const like = await prisma.like.findFirst({
      where: {
        userId,
        postId,
        deleted: false,
      },
    });
    return like ? Like.with(like) : null;
  }
  async hasLiked(userId: number, postId: number): Promise<boolean> {
    const like = await prisma.like.findFirst({
      where: {
        userId,
        postId,
        deleted: false,
      },
    });
    return !!like;  
  }

  async findById(id: number): Promise<Like | null> {
    const like = await prisma.like.findFirst({
      where: { id, deleted: false },
    });
    return like ? Like.with(like) : null;
  }

  async findByUserId(userId: number): Promise<Like[]> {
    const likes = await prisma.like.findMany({
      where: { userId, deleted: false },
    });
    return likes.map((like) => Like.with(like));
  }

  async findByPostId(postId: number): Promise<Like[]> {
    const likes = await prisma.like.findMany({
      where: { postId, deleted: false },
    });
    return likes.map((like) => Like.with(like));
  }

  async countByPostId(postId: number): Promise<number> {
    return await prisma.like.count({
      where: { postId, deleted: false },
    });
  }

  async countByUserId(userId: number): Promise<number> {
    return await prisma.like.count({
      where: { userId, deleted: false },
    });
  }

  async save(like: Like): Promise<Like> {
    const existingLike = await prisma.like.findFirst({
      where: { userId: like.userId, postId: like.postId },
    });

    if (existingLike) {
      if (existingLike.deleted) {
        const updatedLike = await prisma.like.update({
          where: { id: existingLike.id },
          data: { deleted: false },
        });
        return Like.with(updatedLike);
      }
      return Like.with(existingLike);
    }

    const createdLike = await prisma.like.create({
      data: {
        userId: like.userId,
        postId: like.postId,
      },
    });
    return Like.with(createdLike);
  }

  async toggle(userId: number, postId: number): Promise<{ action: string; like: Like | null }> {
    const existingLike = await prisma.like.findFirst({
      where: { userId, postId },
    });

    if (existingLike) {
      if (existingLike.deleted) {
        const updatedLike = await prisma.like.update({
          where: { id: existingLike.id },
          data: { deleted: false },
        });
        return { action: "reactivated", like: Like.with(updatedLike) };
      } else {
        await prisma.like.update({
          where: { id: existingLike.id },
          data: { deleted: true },
        });
        return { action: "deleted", like: null };
      }
    }

    const newLike = await prisma.like.create({
      data: { userId, postId },
    });
    return { action: "created", like: Like.with(newLike) };
  }

  async delete(id: number): Promise<void> {
    await prisma.like.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async findAll(): Promise<Like[]> {
    const likes = await prisma.like.findMany({
      where: { deleted: false },
    });
    return likes.map((like) => Like.with(like));
  }
}

export default LikeRepository;
