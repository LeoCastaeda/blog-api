import { PostService } from '../services/postService';
import { CountLikesDto } from '../dtos/count-likes.dto';

export class CountLikesUseCase {
  constructor(private postService: PostService) {}

  async execute(dto: CountLikesDto): Promise<number> {
    return this.postService.countLikes(dto.postId);
  }
}