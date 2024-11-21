import { Router, Request, Response } from 'express';
import { LikeController } from '../infrastructure/controllers/LikeController';
import { LikeRepository } from '../infrastructure/repositories/LikeRepository';
import { LikeService } from '../application/services/LikeService';
import { PostService } from '../application/services/postService';
import { LikePostUseCase } from '../application/use-cases/LikePostUseCase';
import { CountLikesUseCase } from '../application/use-cases/CountLikesUseCase';
import { authenticateJWT } from '../infrastructure/middlewares/authenticateJWT';
import { PostRepository } from '../infrastructure/repositories/PostRepository';

const router = Router();


const likeRepository = new LikeRepository();
const postRepository = new PostRepository();
const likeService = new LikeService(likeRepository);
const postService = new PostService(postRepository);
const likePostUseCase = new LikePostUseCase(postService);
const countLikesUseCase = new CountLikesUseCase(postService);

const likeController = new LikeController(
    likeService,
    likePostUseCase,
    countLikesUseCase
);

const protectedRouter = Router();

protectedRouter.post('/', (req: Request, res: Response) => {
    likeController.createLike(req, res);
});

protectedRouter.delete('/:id', (req: Request, res: Response) => {
    likeController.removeLike(req, res);
});

protectedRouter.get('/user/:userId', (req: Request, res: Response) => {
    likeController.getLikesByUserId(req, res);
});

protectedRouter.get('/post/:postId', (req: Request, res: Response) => {
    likeController.getLikesByPostId(req, res);
});

protectedRouter.get('/count/post/:postId', (req: Request, res: Response) => {
    likeController.countLikesByPostId(req, res);
});

protectedRouter.get('/count/user/:userId', (req: Request, res: Response) => {
    likeController.countLikesByUserId(req, res);
});


router.use('/', authenticateJWT, protectedRouter);

export default router;