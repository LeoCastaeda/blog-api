import { Like } from '../entities/Like';

export interface ILikeRepository {
  findById(id: number): Promise<Like | null>;
  findByUserId(userId: number): Promise<Like[]>;
  findByPostId(postId: number): Promise<Like[]>;
  save(like: Like): Promise<Like>;
  delete(id: number): Promise<void>;
  countByPostId(postId: number): Promise<number>; 
  countByUserId(userId: number): Promise<number>; 
}

export default ILikeRepository;