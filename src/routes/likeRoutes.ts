import { Router } from 'express';
import { LikeController } from '../infrastructure/controllers/LikeController';
import { LikeService } from '../application/services/LikeService';
import { LikeRepository } from '../infrastructure/repositories/LikeRepository';
import { authenticateJWT } from '../infrastructure/middlewares/authenticateJWT';
import authorizationMiddleware from '../infrastructure/middlewares/authorizeMiddleware';

const likeRouter = Router();

// Instancias necesarias
const likeRepository = new LikeRepository();
const likeService = new LikeService(likeRepository);
const likeController = new LikeController(likeService);

// Ruta para agregar un "like"
likeRouter.post(
  '/',
  authenticateJWT, // Verifica autenticación
  authorizationMiddleware('create'), // Verifica autorización
  (req, res) => likeController.createLike(req, res)
);

// Ruta para eliminar un "like"
likeRouter.delete(
  '/',
  authenticateJWT, // Verifica autenticación
  authorizationMiddleware('delete'), // Verifica autorización
  (req, res) => likeController.removeLike(req, res)
);

// Ruta para contar "likes" de un post
likeRouter.get(
  '/:postId/count',
  authenticateJWT, // Verifica autenticación
  authorizationMiddleware('read'), // Verifica autorización
  (req, res) => likeController.countLikes(req, res)
);

export default likeRouter;

