import { PostService } from '../services/postService';

export class DeletePost {
  constructor(private postService: PostService) {}

  async execute(postId: number): Promise<void> {
    return this.postService.deletePost(postId);
  }
}