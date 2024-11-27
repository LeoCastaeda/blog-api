import { Post } from '../entities/Post';

export interface IPostRepository {
  findById(id: number): Promise<Post | null>;
  findAll(): Promise<Post[]>;
  save(post: Post): Promise<void>;
  update(post: Post): Promise<boolean>;
  delete(id: number): Promise<boolean>;
  countLikes(postId: number): Promise<number>;
  likePost(postId: number, userId: number): Promise<void>;
  findUserPosts(userId: number): Promise<Post[]>;
}

export default IPostRepository;