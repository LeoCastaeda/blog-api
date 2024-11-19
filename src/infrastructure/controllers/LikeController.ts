import { Request, Response } from 'express';
import { LikeRepository } from '../../infrastructure/repositories/LikeRepository';
import { Like } from '../../domain/entities/Like';

const likeRepository = new LikeRepository();

// Función para manejar errores
function handleError(res: Response, error: unknown, customMessage: string): void {
  console.error(error); // Registrar el error para depuración
  if (error instanceof Error) {
    res.status(500).json({ message: customMessage, error: error.message });
  } else {
    res.status(500).json({ message: customMessage, error: 'Error desconocido' });
  }
}

export class LikeController {
  // Crear un nuevo "like"
  async createLike(req: Request, res: Response): Promise<void> {
    const { userId, postId } = req.body;

    try {
      const like = Like.with({
        userId, postId,
        id: 0,
        createdAt: new Date(),
      });
      const savedLike = await likeRepository.save(like);
      res.status(201).json(savedLike);
    } catch (error) {
      handleError(res, error, 'Error al crear el like');
    }
  }

  // Obtener likes por postId
  async getLikesByPost(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;

    try {
      const likes = await likeRepository.findByPostId(Number(postId));
      res.status(200).json(likes);
    } catch (error) {
      handleError(res, error, 'Error al obtener los likes');
    }
  }

  // Eliminar un "like"
  async deleteLike(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      await likeRepository.delete(Number(id));
      res.status(200).json({ message: 'Like eliminado correctamente' });
    } catch (error) {
      handleError(res, error, 'Error al eliminar el like');
    }
  }
}