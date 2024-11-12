import { PostService } from '../services/postService';
import { Post } from '../../domain/entities/Post';

export class GetUserPostUseCase {
  constructor(private postService: PostService) {}

  async execute(userId: number): Promise<Post[]> {
    return this.postService.getUserPosts(userId);
  }
}