import { Router } from 'express';
import { PostService } from '../application/services/postService';
import { PostController } from '../infrastructure/controllers/PostController';
import { PostRepository } from '../infrastructure/repositories/PostRepository';
import { authenticateJWT } from '../infrastructure/middlewares/authenticateJWT';
import authorizationMiddleware from '../infrastructure/middlewares/authorizeMiddleware';

const postRouter = Router();


const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);


postRouter.post('/posts', authenticateJWT, authorizationMiddleware('create_post'), (req, res) => postController.createPost(req, res));
postRouter.get('/posts/details', authenticateJWT, authorizationMiddleware('popular_post'), (req, res) => postController.getPostsWithDetails(req, res));
postRouter.get('/posts/:id', authenticateJWT, authorizationMiddleware('read_post'), (req, res) => postController.getPostById(req, res));
postRouter.delete('/posts/:id', authenticateJWT, authorizationMiddleware('delete_post'), (req, res) => postController.softDeletePost(req, res));
postRouter.post('/posts/:id/recover', authenticateJWT, authorizationMiddleware('recover_post'), (req, res) => postController.recoverPost(req, res));
postRouter.get('/posts', authenticateJWT, authorizationMiddleware('read_post'),  (req, res) => postController.getAllPosts(req, res));
postRouter.put('/posts/:id', authenticateJWT, authorizationMiddleware('update_own_post'), (req, res) => postController.updatePost(req, res));


export default postRouter;