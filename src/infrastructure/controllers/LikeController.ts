import { Request, Response } from 'express';
import { LikeService } from '../../application/services/LikeService';
import { LikePostUseCase } from '../../application/use-cases/LikePostUseCase';
import { CountLikesUseCase } from '../../application/use-cases/CountLikesUseCase';
import { AppError } from '../middlewares/errorHandler';

export class LikeController {
    constructor(
        private readonly likeService: LikeService,
        private readonly likePostUseCase: LikePostUseCase,
        private readonly countLikesUseCase: CountLikesUseCase
    ) {}

    async createLike(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId } = req.body;
            
            if (!userId || !postId) {
                throw new AppError('userId y postId son requeridos', 400);
            }

            const like = await this.likeService.addLike(Number(userId), Number(postId));
            res.status(201).json(like);
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.statusCode).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Error interno al crear like' });
            }
        }
    }

    async removeLike(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            await this.likeService.removeLike(Number(id));
            res.status(200).json({ message: 'Like eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar like' });
        }
    }

    async getLikesByUserId(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const likes = await this.likeService.getLikesByUserId(Number(userId));
            res.status(200).json(likes);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener likes por usuario' });
        }
    }

    async getLikesByPostId(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.params;
            const likes = await this.likeService.getLikesByPostId(Number(postId));
            res.status(200).json(likes);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener likes por post' });
        }
    }

    async countLikesByPostId(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.params;
            const count = await this.countLikesUseCase.execute({ postId: Number(postId) });
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: 'Error al contar likes del post' });
        }
    }

    async countLikesByUserId(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const count = await this.likeService.countLikesByUserId(Number(userId));
            res.status(200).json({ count });
        } catch (error) {
            res.status(500).json({ message: 'Error al contar likes del usuario' });
        }
    }
}