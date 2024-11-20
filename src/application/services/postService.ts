
import { Post } from '../../domain/entities/Post';
import { IPostRepository } from '../../domain/repositories/IPostRepository';

export class PostService {
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

  async deletePost(id: number): Promise<boolean> {
    return this.postRepository.delete(id);
  }

  async countLikes(postId: number): Promise<number> {
    return this.postRepository.countLikes(postId);
  }

  async likePost(postId: number, userId: number): Promise<void> {
    return this.postRepository.likePost(postId, userId);
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return this.postRepository.findUserPosts(userId);
  }
}

export default PostService;