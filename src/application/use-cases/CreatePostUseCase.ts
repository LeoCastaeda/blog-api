import { PostService } from '../services/postService';

export class CreatePost {
  constructor(private postService: PostService) {}

  async execute(title: string, content: string, authorId: number) {
    return this.postService.createPost(title, content, authorId);
  }
}