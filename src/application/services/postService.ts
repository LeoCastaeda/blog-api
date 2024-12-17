import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";
import { PostActionDto } from "../dtos/postAction.dto";

export class PostService {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly userService: any // Replace 'any' with the actual type of userService
  ) {}

  async createPost(title: string, content: string, authorId: number): Promise<Post> {
    if (!title || !content || !authorId) {
      throw new Error("Missing required fields: title, content, authorId");
    }

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

  async updatePost(post: Post): Promise<boolean> {
    await this.postRepository.update(post);
    return true;
  }


  async getUserPosts(authorId: number, includeDeleted: boolean = false): Promise<Post[]> {
    return this.postRepository.findUserPosts(authorId, includeDeleted);
  }

  async deletePost(dto: PostActionDto): Promise<void> {
    PostActionDto.validate(dto);

    const post = await this.postRepository.findByIdIncludingDeleted(dto.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== dto.userId) {
      throw new Error("You can only delete your own posts");
    }

    if (post.deleted) {
      throw new Error("Post is already deleted");
    }

    await this.postRepository.softDelete(dto.postId);
  }
  async permanentlyDeletePost(postId: number): Promise<void> {
    const post = await this.postRepository.findByIdIncludingDeleted(postId);
  
    if (!post) {
      throw new Error("Post not found");
    }
  
    await this.postRepository.deletePermanently(postId);
  }
  async recoverPost(dto: PostActionDto): Promise<void> {
    PostActionDto.validate(dto);

    const post = await this.postRepository.findByIdIncludingDeleted(dto.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.authorId !== dto.userId) {
      throw new Error("You can only recover your own posts");
    }

    if (!post.deleted) {
      throw new Error("Post is not deleted");
    }

    await this.postRepository.recover(dto.postId);
  }

  async getPostsWithDetails(): Promise<any[]> {
    const posts = await this.postRepository.findAllWithDetails();

    return posts.map(post => {
      const enrichedPost = Post.with(post);
      const popularity = enrichedPost.calculatePopularity(post.totalUsers || 0, post.likes || 0);

      return enrichedPost.enrichDetails(post.author, popularity);
    });
  }
}

export default PostService;

 