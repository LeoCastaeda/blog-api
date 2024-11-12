import { PostService } from '../services/postService';

export class CountLikesUseCase {
  constructor(private postService: PostService) {}

  async execute(postId: number): Promise<number> {
    return this.postService.countLikes(postId);
  }
}