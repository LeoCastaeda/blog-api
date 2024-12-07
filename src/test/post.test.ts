import { Request, Response } from 'express';
import { PostController } from '../infrastructure/controllers/PostController';
import { PostService } from '../application/services/postService';
import { IPostRepository } from '../domain/repositories/IPostRepository';
import { Post } from '../domain/entities/Post';
import { Role } from '../domain/entities/Role'; // Add this import
import { PostActionDto } from '../application/dtos/postAction.dto';

describe('PostController', () => {
  describe('createPost', () => {
    let postController: PostController;
    let postService: PostService;
    let req: Request;
    let res: Response;

    beforeEach(() => {
      const postRepository = {
        findById: jest.fn().mockResolvedValue(null),
      } as unknown as IPostRepository; // Mock or create an instance of IPostRepository
      postService = new PostService(postRepository);
      postController = new PostController(postService);
      req = {
        body: {
          title: 'Test Title',
          content: 'Test Content',
          authorId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deleted: false,
          likes: 0,
        },
      } as Request;
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;
    });

    it('should create a new post successfully', async () => {
      const post = { title: 'Test Title', content: 'Test Content', authorId: 1 };
      jest.spyOn(postService, 'createPost').mockResolvedValue(post as Post);

      await postController.createPost(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(post);
    });

    it('should return 500 error if required fields are missing', async () => {
      req.body = {};

      await postController.createPost(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Missing required fields: title, content, authorId',
      });
    });

    it('should return 500 error if postService.createPost throws an error', async () => {
      const error = new Error('Test Error');
      jest.spyOn(postService, 'createPost').mockRejectedValue(error);

      await postController.createPost(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({
        error: error.message,
      });
    });

    it('should return 500 error if postService.createPost throws a non-Error object', async () => {
      const error = 'Test Error';
      jest.spyOn(postService, 'createPost').mockRejectedValue(error);

      await postController.createPost(req, res);

      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ error: 'Error al crear el post',});
    });

    it('should return post by ID', async () => {
        
        const post1 = Post.create('Test Post', 'Test Content', 1);
        jest.spyOn(postService, 'getPostById').mockResolvedValue(post1);
        req.params = { id: '1' }; // Set up the req.params object correctly
        await postController.getPostById(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(post1);
      });
      it('should return 404 when post not found by ID', async () => {
        jest.spyOn(postService, 'getPostById').mockResolvedValue(null);
        req.params = { id: '1' }; // Ensure req.params is defined
        await postController.getPostById(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post no encontrado' });
      });
      it('should return 500 when error getting post by ID', async () => {
        const error = new Error('Test error');
        jest.spyOn(postService, 'getPostById').mockRejectedValue(error);
        await postController.getPostById(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ "error": "Cannot destructure property 'id' of 'req.params' as it is undefined."});
      });

      it('should return 200 with all posts', async () => {
        
        const posts: Post[] = [
            Post.create('Test Post 1', 'Test Content 1', 1),
            Post.create('Test Post 2', 'Test Content 2', 2),
            // Add more Post objects here
          ];
        jest.spyOn(postService, 'getAllPosts').mockResolvedValue(posts);
        await postController.getAllPosts(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(posts);
      });
      it('should return 500 with error message when postService.getAllPosts() throws an error', async () => {
        const error = new Error('Test Error');
        jest.spyOn(postService, 'getAllPosts').mockRejectedValue(error);
        await postController.getAllPosts(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
      }); 

      it('should update post successfully', async () => {
        const postId = 1;
        const title = 'New Title';
        const content = 'New Content';
        const post = Post.create(title, content, postId);
        req.params = { id: postId.toString() };
        req.body.title = title;
        req.body.content = content;
        jest.spyOn(postService, 'getPostById').mockResolvedValue(post);
        jest.spyOn(postService, 'updatePost').mockResolvedValue(true);
        await postController.updatePost(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Post actualizado exitosamente',
          post,
        });
      });
      it('should return 404 if post not found', async () => {
        const postId = 1;
        req.params = { id: postId.toString() };
        jest.spyOn(postService, 'getPostById').mockResolvedValue(null);
        await postController.updatePost(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post no encontrado' });
      });
      it('should return 500 if error updating post', async () => {
        const postId = 1;
        const title = 'New Title';
        const content = 'New Content';
        const post = Post.create(title, content, postId);
        req.params = { id: postId.toString() };
        req.body.title = title;
        req.body.content = content;
        jest.spyOn(postService, 'getPostById').mockResolvedValue(post);
        jest.spyOn(postService, 'updatePost').mockRejectedValue(new Error('Test error'));
        await postController.updatePost(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
          error: 'Test error',
        });
      });
      it('should return 404 if missing title and content in request body', async () => {
        const postId = 1;
        req.params = { id: postId.toString() };
        await postController.updatePost(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Post no encontrado',
        });
      });
      it('should return 404 if invalid post ID', async () => {
        req.params = { id: 'invalid' };
        await postController.updatePost(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Post no encontrado',
        });
      });
      describe('softDeletePost', () => {
        let postController: PostController;
        let postService: PostService;
        let req: Request;
        let res: Response;
    
        beforeEach(() => {
          const postRepository = {
            findById: jest.fn().mockResolvedValue(null),
          } as unknown as IPostRepository; // Mock or create an instance of IPostRepository
          postService = new PostService(postRepository);
          postController = new PostController(postService);
          req = {
            params: {
              id: '1',
            },
            user: {
              id: 1,
            },
          } as unknown as Request;
          res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
          } as unknown as Response;
        });
    
        it('should soft delete post with authenticated user', async () => {
          const deletePostSpy = jest.spyOn(postService, 'deletePost').mockResolvedValue(undefined);
          await postController.softDeletePost(req, res);
          expect(deletePostSpy).toHaveBeenCalledTimes(1);
          expect(res.status).toHaveBeenCalledTimes(1);
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledWith({ message: 'Post eliminado exitosamente' });
        });
    
        it('should return 401 with unauthenticated user', async () => {
          req.user = undefined;
          await postController.softDeletePost(req, res);
          expect(res.status).toHaveBeenCalledTimes(1);
          expect(res.status).toHaveBeenCalledWith(401);
          expect(res.json).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no autenticado' });
        });
    
        it('should return 500 with invalid post ID', async () => {
          req.params.id = 'invalid';
          await postController.softDeletePost(req, res);
          expect(res.status).toHaveBeenCalledTimes(1);
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledWith({
            message: "Invalid postId: must be a number.",
          });
        });
    
        it('should return 500 with error in postService.deletePost', async () => {
          const error = new Error('Test error');
          jest.spyOn(postService, 'deletePost').mockRejectedValue(error);
          await postController.softDeletePost(req, res);
          expect(res.status).toHaveBeenCalledTimes(1);
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledWith({
            message: error.message,
          });
        });
      });
      it('should return 401 if user is not authenticated', async () => {
        req.user = undefined;
        req.params = { id: '1' };
        await postController.recoverPost(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuario no autenticado' });
      });
      it('should call postService.recoverPost with correct parameters', async () => {
        const postId = 1;
        const userId = 2;
        req.params = { id: postId.toString() };
        req.user = { id: userId, role: 'someRole' as Role };
        const recoverPostSpy = jest.spyOn(postService, 'recoverPost');
        await postController.recoverPost(req, res);
        expect(recoverPostSpy).toHaveBeenCalledWith(new PostActionDto(postId, userId));
      });
      it('should return 200 with success message on successful recovery', async () => {
        const postId = 1;
        const userId = 2;
        req.params = { id: postId.toString() };
        req.user = { id: userId, role: 'someRole' as Role };
        jest.spyOn(postService, 'recoverPost').mockResolvedValue(); // Mock the recoverPost method to resolve without throwing an error
        await postController.recoverPost(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post recuperado exitosamente' });
      });
      it('should return 500 with error message on error', async () => {
        const postId = 1;
        const userId = 2;
        const error = new Error('Test Error');
        jest.spyOn(postService, 'recoverPost').mockRejectedValue(error);
        req.params = { id: postId.toString() };
        req.user = { id: userId, role: 'someRole' as Role };
        await postController.recoverPost(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: error.message });
      });
  });
});
describe('PostController', () => {
    describe('getPostsWithDetails', () => {
      let postController: PostController;
      let postService: PostService;
      let req: Request;
      let res: Response;
      beforeEach(() => {
        const postRepository = {} as IPostRepository; // Mock or create an instance of IPostRepository
        postService = new PostService(postRepository);
        postController = new PostController(postService);
        req = {} as Request;
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnThis(),
        } as unknown as Response;
      });
      it('should return 200 with posts', async () => {
        const posts = [{ id: 1, title: 'Post 1' }, { id: 2, title: 'Post 2' }];
        jest.spyOn(postService, 'getPostsWithDetails').mockResolvedValue(posts);
        await postController.getPostsWithDetails(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith(posts);
      });
      it('should return 500 with error message when postService.getPostsWithDetails() throws an error', async () => {
        const error = new Error('Test error');
        jest.spyOn(postService, 'getPostsWithDetails').mockRejectedValue(error);
        await postController.getPostsWithDetails(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: error.message });
      });
      it('should return 500 with error message when postService.getPostsWithDetails() throws a non-Error object', async () => {
        const error = 'Test error';
        jest.spyOn(postService, 'getPostsWithDetails').mockRejectedValue(error);
        await postController.getPostsWithDetails(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error al obtener los detalles' });
      });
    });
  });