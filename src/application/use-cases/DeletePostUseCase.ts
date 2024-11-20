import { EditPostDto } from '../dtos/edit-post.dto';
import { PostService } from '../services/postService';
import { Post } from '../../domain/entities/Post';

export class EditPostUseCase {
  constructor(private postService: PostService) {}

  async execute(dto: EditPostDto): Promise<void> {
    const post = Post.with({
      id: dto.id,
      title: dto.title,
      content: dto.content,
      authorId: dto.authorId,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      deleted: dto.deleted
    });
    return this.postService.updatePost(post);
  }
}