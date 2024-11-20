import { PostService } from '../services/postService';
import { PostDto } from '../dtos/post.dto';

export class GetUserPostUseCase {
  constructor(private postService: PostService) {}

  async execute(userId: number): Promise<PostDto[]> {
    const posts = await this.postService.getUserPosts(userId);
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt
    }));
  }
}