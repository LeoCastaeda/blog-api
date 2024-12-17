import { Post } from '../entities/Post';

export interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  save(post: Post): Promise<void>;
  update(post: Post): Promise<boolean>;
  findUserPosts(userId: number, includeDeleted: boolean): Promise<Post[]>;
  findByIdIncludingDeleted(id: number): Promise<Post | null>;
  softDelete(id: number): Promise<void>;
  recover(id: number): Promise<void>;
  findAllWithDetails(): Promise<any[]>
  deletePermanently(id: number): Promise<void>;
  


}

export default IPostRepository;