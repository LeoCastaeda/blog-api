import { Post } from '../../domain/entities/Post';
import { IPostRepository } from '../../domain/repositories/IPostRepository';

export class PostService {
  countLikes(postId: number): number | PromiseLike<number> {
      throw new Error('Method not implemented.');
  }
  likePost(postId: number, userId: number): void | PromiseLike<void> {
      throw new Error('Method not implemented.');
  }
  getUserPosts(userId: number): Post[] | PromiseLike<Post[]> {
      throw new Error('Method not implemented.');
  }
  constructor(private postRepository: IPostRepository) {}

  async createPost(title: string, content: string, authorId: number): Promise<Post> {
    const post = Post.create(title, content, authorId);
    await this.postRepository.save(post);
    return post;
  }

  async getPostById(id: number): Promise<Post | null> {
    return this.postRepository.findById(id);
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.findAll();
  }

  async updatePost(post: Post): Promise<void> {
    await this.postRepository.update(post);
  }

  async deletePost(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }
}

export default PostService;