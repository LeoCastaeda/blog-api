import { Request, Response } from "express";
import { PostService } from "../../application/services/postService";
import { body, param, validationResult } from "express-validator";

export class PostController {
  constructor(private postService: PostService) {}

  async createPost(req: Request, res: Response): Promise<void> {
    await body('title').isString().notEmpty().run(req);
    await body('content').isString().notEmpty().run(req);
    await body('authorId').isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    try {
      const { title, content, authorId } = req.body;
      const post = await this.postService.createPost(title, content, authorId);
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    await param('id').isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    try {
      const { id } = req.params;
      const post = await this.postService.getPostById(Number(id));
      if (post !== null) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    await param('id').isInt().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    try {
      const { id } = req.params;
      const deletedPost = await this.postService.deletePost(Number(id));
      if (deletedPost) {
        res.status(200).json({ message: 'Post deleted successfully' });
      } else {
        res.status(404).json({ message: 'Post not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  async getAllPosts(req: Request, res: Response): Promise<void> {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
  async updatePost(req: Request, res: Response): Promise<void> {
    // Validar los parámetros de entrada
    await param('id').isInt().run(req);
    await body('title').optional().isString().notEmpty().run(req);
    await body('content').optional().isString().notEmpty().run(req);

    // Comprobar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    try {
        const { id } = req.params;
        const { title, content } = req.body;

        // Obtener el post existente
        const postToUpdate = await this.postService.getPostById(Number(id));
        if (!postToUpdate) {
            res.status(404).json({ message: 'Post not found' });
            return;
        }

        // Actualizar el título y contenido usando los métodos definidos en la clase Post
        if (title) {
            postToUpdate.updateTitle(title);
        }
        if (content) {
            postToUpdate.updateContent(content);
        }

        // Llamar al servicio para actualizar el post en la base de datos
        const updateSuccess = await this.postService.updatePost(postToUpdate);
        if (updateSuccess) {
            res.status(200).json({ message: 'Post updated successfully', post: postToUpdate });
        } else {
            res.status(500).json({ message: 'Failed to update post' });
        }
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
} 
  }
