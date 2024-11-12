import { Post } from '../entities/Post';

export interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  save(post: Post): Promise<void>;
  update(post: Post): Promise<void>;
  delete(id: number): Promise<void>;
}

export default IPostRepository;