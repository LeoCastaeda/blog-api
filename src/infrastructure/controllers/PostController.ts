import { Request, Response } from "express";
import { PostService } from "../../application/services/postService";

export class PostController {
  constructor(private postService: PostService) {}

  async createPost(req: Request, res: Response) {
    try {
      const { title, content, authorId } = req.body;
      const post = await this.postService.createPost(title, content, authorId);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unknown error' });
      }
    }
  }

  async getPostById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const post = await this.postService.getPostById(Number(id));
      if (post !== null) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(400).json({ error: 'Unknown error' });
      }
    }
  }

  async deletePost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedPost = await this.postService.deletePost(Number(id));
      if (deletedPost) {
        res.status(200).json({ message: 'Post deleted successfully' });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unknown error' });
      }
    }
  }

  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unknown error' });
      }
    }
  }
}