import { PostService } from '../services/postService';
import { CreatePostDto } from '../dtos/create-post.dto';

export class CreatePost {
  constructor(private postService: PostService) {}

  async execute(dto: CreatePostDto) {
    return this.postService.createPost(dto.title, dto.content, dto.authorId);
  }
}