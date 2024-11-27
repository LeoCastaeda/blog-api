import { LikePostDto } from '../dtos/like-post.dto';
import { LikeService } from '../services/LikeService';

export class LikePostUseCase {
  constructor(private likeService: LikeService) {}

  async execute(dto: LikePostDto): Promise<void> {
    await this.likeService.addLike(dto);
  }
}
