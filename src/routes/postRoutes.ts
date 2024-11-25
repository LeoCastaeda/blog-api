import { Router } from 'express';
import { PostService } from '../application/services/postService';
import { PostController } from '../infrastructure/controllers/PostController';
import { PostRepository } from '../infrastructure/repositories/PostRepository';

const router = Router();


const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

router.post('/posts', (req, res) => postController.createPost(req, res));
router.get('/posts/:id', (req, res) => postController.getPostById(req, res));
router.delete('/posts/:id', (req, res) => postController.deletePost(req, res));
router.get('/posts', (req, res) => postController.getAllPosts(req, res));

export default router;