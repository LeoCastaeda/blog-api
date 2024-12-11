import { Request, Response } from "express";
import { PostService } from "../../application/services/postService";
import { PostActionDto } from "../../application/dtos/postAction.dto";

export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * Crear un nuevo post
   */
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { title, content, authorId } = req.body;
      const post = await this.postService.createPost(title, content, authorId);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Error al crear el post",
      });
    }
  }

  /**
   * Obtener un post por ID
   */  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const post = await this.postService.getPostById(Number(id));
      
  
      if (!post) {
        res.status(404).json({ message: "Post no encontrado" });
        return;
      }
  
      res.status(200).json(post);
    } catch (error) {
      
      res.status(500).json({
        error: error instanceof Error ? error.message : "Error al obtener el post",
      });
    }
  }

 
  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Error al obtener los posts",
      });
    }
  }

 
  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, content } = req.body;

      const post = await this.postService.getPostById(Number(id));

      if (!post) {
        res.status(404).json({ message: "Post no encontrado" });
        return;
      }

      if (title) post.updateTitle(title);
      if (content) post.updateContent(content);

      await this.postService.updatePost(post);

      res.status(200).json({ message: "Post actualizado exitosamente", post });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Error al actualizar el post",
      });
    }
  }

  
  async softDeletePost(req: Request, res: Response): Promise<void> {
    try {
      const postId = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const dto = new PostActionDto(postId, Number(userId));
      await this.postService.deletePost(dto);

      res.status(200).json({ message: "Post eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Error al eliminar el post",
      });
    }
  }

  
  async recoverPost(req: Request, res: Response): Promise<void> {
    try {
      const postId = Number(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const dto = new PostActionDto(postId, userId);
      await this.postService.recoverPost(dto);

      res.status(200).json({ message: "Post recuperado exitosamente" });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error
          ? error.message
          : "Error al recuperar el post",
      });
    }
  }

  
  async getPostsWithDetails(req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.postService.getPostsWithDetails();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Error al obtener los detalles",
      });
    }
  }
}
