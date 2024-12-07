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
    const likeRepository = {} as LikeRepository; // Mock or create an instance of LikeRepository
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

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'userId es requerido' });
    });

    it('should return 500 error if postId is missing', async () => {
      req.user = { id: 1, role: 'user' as Role };
      await likeController.createLike(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor', });
    });

    it('should return 201 if like is created successfully', async () => {
      req.user = { id: 1, role: 'user' as Role };
      req.body = { postId: 1 };
      const like = Like.create(
        1, 1
      );
      jest.spyOn(likeService, 'addLike').mockResolvedValue(like);

      await likeController.createLike(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Like agregado correctamente',
        like: like.toJSON(),
      });
    });

    it('should return 409 if like already exists', async () => {
      req.user = { id: 1, role: 'user' as Role };
      req.body = { postId: 1 };
      const error = new Error('Ya has dado like a este post');
      jest.spyOn(likeService, 'addLike').mockRejectedValue(error);

      await likeController.createLike(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });

    it('should return 500 error if likeService.addLike throws an error', async () => {
      req.user = { id: 1, role: 'user' as Role };
      req.body = { postId: 1 };
      const error = new Error('Test Error');
      jest.spyOn(likeService, 'addLike').mockRejectedValue(error);

      await likeController.createLike(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
    });
  });
  it('should return 400 error when userId or postId is missing', async () => {
    req.user = undefined;
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(likeService, 'removeLike').mockResolvedValue();
    await likeController.removeLike(req, mockRes as any);
    expect(mockRes.status).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledTimes(1);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'userId es requerido' });

  });
  it('should return 200 success response when userId and postId are valid', async () => {
    req.user = { id: 1, role: 'user' as Role };
    req.body = { postId: 1 };
    jest.spyOn(likeService, 'removeLike').mockResolvedValue();
    await likeController.removeLike(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    
  });
  it('should return 404 error when like does not exist', async () => {
    req.user = { id: 1, role: 'user' as Role };
    req.body = { postId: 1 };
    const error = new Error('No puedes eliminar un like que no existe');
    jest.spyOn(likeService, 'removeLike').mockRejectedValue(error);
    await likeController.removeLike(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: error.message });
  });
  it('should return 500 error when internal server error occurs', async () => {
    req.user = { id: 1, role: 'user' as Role };
    req.body = { postId: 1 };
    const error = new Error('Internal server error');
    jest.spyOn(likeService, 'removeLike').mockRejectedValue(error);
    await likeController.removeLike(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
  });

  
  it('should return 200 with like count', async () => {
    req.params = { postId: '1' };
    jest.spyOn(likeService, 'countLikesByPost').mockResolvedValue(10);
    await likeController.countLikes(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ count: 10 });
  });
  it('should return 400 with error message when postId is missing', async () => {
    req.params = {};
    await likeController.countLikes(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'postId es requerido' });
  });
  it('should return 500 with error message when likeService.countLikesByPost throws an error', async () => {
    req.params = { postId: '1' };
    jest.spyOn(likeService, 'countLikesByPost').mockRejectedValue(new Error('Test Error'));
    await likeController.countLikes(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error interno del servidor' });
  });

});