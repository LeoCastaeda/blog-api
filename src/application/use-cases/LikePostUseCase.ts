import { LikePostDto } from '../dtos/like-post.dto';
import { PostService } from '../services/postService';

export class LikePostUseCase {
  constructor(private postService: PostService) {}

  async execute(dto: LikePostDto): Promise<void> {
    const { postId, userId } = dto;
    return this.postService.likePost(postId, userId);
  }
}