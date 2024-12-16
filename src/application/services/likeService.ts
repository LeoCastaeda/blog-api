import { LikePostDto } from '../dtos/like-post.dto';
import { CountLikesDto } from '../dtos/count-likes.dto';
import { LikeRepository } from '../../infrastructure/repositories/LikeRepository';
import { Like } from '../../domain/entities/Like';

export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  async addLike(dto: LikePostDto): Promise<Like> {
    const { userId, postId } = dto;

    const existingLike = await this.likeRepository.findByUserIdAndPostId(userId, postId);
    if (existingLike) {
      throw new Error('Ya has dado like a este post');
    }

    const like = Like.create(userId, postId);
    return this.likeRepository.save(like);
  }
  async hasLiked({ userId, postId }: { userId: number; postId: number }): Promise<boolean> {
    return this.likeRepository.hasLiked(userId, postId);
  }
  

  async removeLike(dto: LikePostDto): Promise<void> {
    const { userId, postId } = dto;

    const existingLike = await this.likeRepository.findByUserIdAndPostId(userId, postId);
    if (!existingLike) {
      throw new Error('No puedes eliminar un like que no existe');
    }

    await this.likeRepository.delete(existingLike.id!);
  }

  async countLikesByPost(dto: CountLikesDto): Promise<number> {
    const { postId } = dto;
    return this.likeRepository.countByPostId(postId);
  }
}
