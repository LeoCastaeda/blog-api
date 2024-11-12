import { PostService } from '../services/postService';
import { Post } from '../../domain/entities/Post';

export class GetAllPostsUseCase {
  constructor(private postService: PostService) {}

  async execute(): Promise<Post[]> {
    return this.postService.getAllPosts();
  }
}