import { PostService } from '../services/postService';

export class LikePostUseCase {
  constructor(private postService: PostService) {}

  async execute(postId: number, userId: number): Promise<void> {
    return this.postService.likePost(postId, userId);
  }
}