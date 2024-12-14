import { Request, Response } from 'express';
import { LikeService } from '../../application/services/LikeService';

export class LikeController {
  constructor(private  likeService: LikeService) {}

 
  async createLike(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; 
      if (!userId) {
        res.status(400).json({ error: 'userId es requerido' });
        return;
      }
      const { postId } = req.body;

      
      if (!postId) {
        res.status(400).json({ error: 'postId son requeridos' });
        return;
      }
      const likeExists = await this.likeService.hasLiked({ userId, postId });
      if (likeExists) {
        res.status(200).json({ message: "Ya has dado like a este post" });
        return;
      }

     
      const like = await this.likeService.addLike({ userId, postId });
      res.status(201).json({
        message: 'Like agregado correctamente',
        like: like.toJSON(),
      });
    } catch (error) {
      
      
        res.status(500).json({ error: 'Error interno del servidor' });
      
    }
  }

  
  async removeLike(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ error: 'userId es requerido' });
        return;
      }
      const { postId } = req.body;

       
      if (!postId) {
        res.status(400).json({ error: 'postId es requerido' });
        return;
      }

     
      await this.likeService.removeLike({ userId, postId });
      res.status(200).json({ message: 'Like eliminado correctamente' });
    } catch (error) {
       
      if (error instanceof Error && error.message === 'No puedes eliminar un like que no existe') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }
 
  async countLikes(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;

      // Validar datos requeridos
      if (!postId) {
        res.status(400).json({ error: 'postId es requerido' });
        return;
      }

     
      const count = await this.likeService.countLikesByPost({ postId: Number(postId) });
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}