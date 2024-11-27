import { Router } from 'express';
import { PostService } from '../application/services/postService';
import { PostController } from '../infrastructure/controllers/PostController';
import { PostRepository } from '../infrastructure/repositories/PostRepository';

const postRouter = Router();


const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

postRouter.post('/posts', (req, res) => postController.createPost(req, res));
postRouter.get('/posts/:id', (req, res) => postController.getPostById(req, res));
postRouter.delete('/posts/:id', (req, res) => postController.deletePost(req, res));//soft delete
postRouter.get('/posts', (req, res) => postController.getAllPosts(req, res));
postRouter.put('/posts/:id', (req, res) => postController.updatePost(req, res));

export default postRouter;