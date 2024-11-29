export class PostActionDto {
    constructor(
      public postId: number,
      public userId: number
    ) {}
  
    
    static validate(dto: PostActionDto): void {
      if (!dto.postId || isNaN(dto.postId)) {
        throw new Error("Invalid postId: must be a number.");
      }
      if (!dto.userId || isNaN(dto.userId)) {
        throw new Error("Invalid userId: must be a number.");
      }
    }
  }
  