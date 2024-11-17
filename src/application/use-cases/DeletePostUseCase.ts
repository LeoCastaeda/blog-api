import { PostService } from '../services/postService';

export class DeletePost {
  constructor(private postService: PostService) {}

  async execute(postId: number): Promise<void> {
    await this.postService.deletePost(postId);
  }
}