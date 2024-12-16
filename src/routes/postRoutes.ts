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

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API for managing posts
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
postRouter.get('/', authenticateJWT, authorizationMiddleware('read_post'), postController.getAllPosts.bind(postController));

/**
 * @swagger
 * /api/posts/details:
 *   get:
 *     summary: Get posts with detailed information
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of posts with details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostDetails'
 */
postRouter.get('/details', authenticateJWT, authorizationMiddleware('read_post'), postController.getPostsWithDetails.bind(postController));

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: The post data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post not found
 */
postRouter.get('/:id', authenticateJWT, authorizationMiddleware('read_post'), postController.getPostById.bind(postController));

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *                 example: "My second Post"
 *               content:
 *                 type: string
 *                 description: The content of the post
 *                 example: "This is the content of my second post"
 *               authorId:
 *                 type: integer
 *                 description: The ID of the author
 *                 example: 6
 *     responses:
 *       201:
 *         description: Post created successfully
 */
postRouter.post('/', authenticateJWT, authorizationMiddleware('create_post'), postController.createPost.bind(postController));

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostInput'
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
postRouter.put('/:id', authenticateJWT, authorizationMiddleware('update_own_post'), postController.updatePost.bind(postController));

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Soft delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
postRouter.delete('/:id', authenticateJWT, authorizationMiddleware('delete_post'), postController.softDeletePost.bind(postController));

/**
 * @swagger
 * /api/posts/{id}/recover:
 *   post:
 *     summary: Recover a soft-deleted post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The post ID
 *     responses:
 *       200:
 *         description: Post recovered successfully
 */
postRouter.post('/:id/recover', authenticateJWT, authorizationMiddleware('recover_post'), postController.recoverPost.bind(postController));
/**
 * @swagger
 * /api/posts/author/{authorId}:
 *   get:
 *     summary: Get posts by author ID
 *     tags: 
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: author
 *         required: true
 *         schema:
 *           type: string
 *         description: The author's name or identifier
 *       - in: path
 *         name: authorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the author
 *     responses:
 *       200:
 *         description: The posts data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: The post ID
 *                   title:
 *                     type: string
 *                     description: The post title
 *                   content:
 *                     type: string
 *                     description: The post content
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the post was created
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the post was last updated
 *       404:
 *         description: Author not found
 *       500:
 *         description: Internal server error
 */
postRouter.get('/:author/:authorId', authenticateJWT, authorizationMiddleware('read_post'), postController.getAuthorPosts.bind(postController));

 

export default postRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The post ID
 *         title:
 *           type: string
 *           description: The post title
 *         content:
 *           type: string
 *           description: The post content
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the post was last updated
 *     PostInput:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *     PostDetails:
 *       type: object
 *       allOf:
 *         - $ref: '#/components/schemas/Post'
 *       properties:
 *         author:
 *           type: string
 *           description: The author of the post
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The comment ID
 *               content:
 *                 type: string
 *                 description: The comment content
 */
