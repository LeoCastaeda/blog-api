import { Like } from '../../domain/entities/Like';
import { ILikeRepository } from '../../domain/repositories/ILikeRepository';

export class LikeService {
  constructor(private likeRepository: ILikeRepository) {}

  async addLike(userId: number, postId: number): Promise<Like> {
    const like = Like.create(userId, postId);
    await this.likeRepository.save(like);
    return like;
  }

  async removeLike(id: number): Promise<void> {
    await this.likeRepository.delete(id);
  }

  async getLikesByUserId(userId: number): Promise<Like[]> {
    return this.likeRepository.findByUserId(userId);
  }

  async getLikesByPostId(postId: number): Promise<Like[]> {
    return this.likeRepository.findByPostId(postId);
  }

  async countLikesByPostId(postId: number): Promise<number> {
    return this.likeRepository.countByPostId(postId);
  }

  async countLikesByUserId(userId: number): Promise<number> {
    return this.likeRepository.countByUserId(userId);
  }

  // Nuevos métodos
  async getLikeById(id: number): Promise<Like | null> {
    return this.likeRepository.findById(id);
  }

  async getAllLikes(): Promise<Like[]> {
    return this.likeRepository.findAll();
  }
}