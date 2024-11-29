import { LikeService } from '../services/LikeService';
import { CountLikesDto } from '../dtos/count-likes.dto';

export class CountLikesUseCase {
  constructor(private likeService: LikeService) {}

  async execute(dto: CountLikesDto): Promise<number> {
    return this.likeService.countLikesByPost(dto);
  }
}