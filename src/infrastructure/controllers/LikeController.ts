import { Request, Response } from 'express';
import { LikeService } from '../../application/services/LikeService';

export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  /**
   * Crear un "like" en un post
   */
  async createLike(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // Asume que el middleware agrega req.user
      if (!userId) {
        res.status(400).json({ error: 'userId es requerido' });
        return;
      }
      const { postId } = req.body;

      // Validar datos requeridos
      if (!postId) {
        res.status(400).json({ error: 'postId son requeridos' });
        return;
      }

      // Agregar like
      const like = await this.likeService.addLike({ userId, postId });
      res.status(201).json({
        message: 'Like agregado correctamente',
        like: like.toJSON(),
      });
    } catch (error) {
      // Manejar errores
      if (error instanceof Error && error.message === 'Ya has dado like a este post') {
        res.status(409).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  /**
   * Eliminar un "like" de un post
   */
  async removeLike(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { postId } = req.body;

      // Validar datos requeridos
      if (!userId || !postId) {
        res.status(400).json({ error: 'userId y postId son requeridos' });
        return;
      }

      // Eliminar like
      await this.likeService.removeLike({ userId, postId });
      res.status(200).json({ message: 'Like eliminado correctamente' });
    } catch (error) {
      // Manejar errores
      if (error instanceof Error && error.message === 'No puedes eliminar un like que no existe') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  /**
   * Contar los "likes" de un post
   */
  async countLikes(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;

      // Validar datos requeridos
      if (!postId) {
        res.status(400).json({ error: 'postId es requerido' });
        return;
      }

      // Contar likes
      const count = await this.likeService.countLikesByPost({ postId: Number(postId) });
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}