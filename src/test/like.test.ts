import { Request, Response } from 'express';
import { LikeController } from '../infrastructure/controllers/LikeController';
import { LikeService } from '../application/services/LikeService';
import LikeRepository from '../infrastructure/repositories/LikeRepository';
import { Role } from '../domain/entities/Role';
import { Like } from '../domain/entities/Like';

describe('LikeController', () => {
  let likeController: LikeController;
  let likeService: LikeService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    const likeRepository = {} as LikeRepository;
    likeService = new LikeService(likeRepository);
    likeController = new LikeController(likeService);
    req = {} as Request;
    res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLike', () => {
    it('should return 400 error if userId is missing', async () => {
      await likeController.createLike(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'userId es requerido' });
    });

    it('should return 400 error if postId is missing', async () => {
      req.user = { id: 1, role: 'user' as Role };
      await likeController.createLike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ "error": 'Error interno del servidor' });
    });

    it('should return 200 if like already exists', async () => {
      req.user = { id: 1, role: 'user' as Role };
      req.body = { postId: 1 };
      jest.spyOn(likeService, 'hasLiked').mockResolvedValue(true);

      await likeController.createLike(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ya has dado like a este post',
      });
    });

    it('should return 201 if like is created successfully', async () => {
      req.user = { id: 1, role: 'user' as Role };
      req.body = { postId: 1 };
      jest.spyOn(likeService, 'hasLiked').mockResolvedValue(false);
      const like = Like.create(1, 1);
      jest.spyOn(likeService, 'addLike').mockResolvedValue(like);

      await likeController.createLike(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Like agregado correctamente',
        like: like.toJSON(),
      });
    });

    it('should return 500 error if likeService.addLike throws an error', async () => {
      req.user = { id: 1, role: 'user' as Role };
      req.body = { postId: 1 };
      jest.spyOn(likeService, 'hasLiked').mockResolvedValue(false);
      jest.spyOn(likeService, 'addLike').mockRejectedValue(new Error('Test Error'));

      await likeController.createLike(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });

  describe('removeLike', () => {
    it('should return 400 error when userId or postId is missing', async () => {
      req.user = undefined;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await likeController.removeLike(req, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'userId es requerido' });
    });

    it('should return 200 success response when like is removed successfully', async () => {
      req.user = { id: 1, role: 'user' as Role };
      req.body = { postId: 1 };
      jest.spyOn(likeService, 'removeLike').mockResolvedValue();

      await likeController.removeLike(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Like eliminado correctamente' });
    });

    it('should return 404 error when like does not exist', async () => {
      req.user = { id: 1, role: 'user' as Role };
      req.body = { postId: 1 };
      jest.spyOn(likeService, 'removeLike').mockRejectedValue(new Error('No puedes eliminar un like que no existe'));

      await likeController.removeLike(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'No puedes eliminar un like que no existe' });
    });
  });

  describe('countLikes', () => {
    it('should return 200 with like count', async () => {
      req.params = { postId: '1' };
      jest.spyOn(likeService, 'countLikesByPost').mockResolvedValue(10);

      await likeController.countLikes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ count: 10 });
    });

    it('should return 400 with error message when postId is missing', async () => {
      req.params = {};

      await likeController.countLikes(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'postId es requerido' });
    });

    it('should return 500 with error message when countLikesByPost throws an error', async () => {
      req.params = { postId: '1' };
      jest.spyOn(likeService, 'countLikesByPost').mockRejectedValue(new Error('Test Error'));

      await likeController.countLikes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });
});
