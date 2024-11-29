import { Post } from '../entities/Post';

export interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  save(post: Post): Promise<void>;
  update(post: Post): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  findUserPosts(userId: number): Promise<Post[]>;
  findByIdIncludingDeleted(id: number): Promise<Post | null>;
  softDelete(id: number): Promise<void>;
  recover(id: number): Promise<void>;
  findAllWithDetails(): Promise<any[]>
  


}

export default IPostRepository;