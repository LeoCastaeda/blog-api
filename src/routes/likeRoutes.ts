import { Router } from "express";
import { LikeService } from "../application/services/LikeService";
import { LikeController } from "../infrastructure/controllers/LikeController";
import { LikeRepository } from "../infrastructure/repositories/LikeRepository";
import { authenticateJWT } from "../infrastructure/middlewares/authenticateJWT";
import authorizationMiddleware from "../infrastructure/middlewares/authorizeMiddleware";

const likeRouter = Router();


const likeRepository = new LikeRepository();
const likeService = new LikeService(likeRepository);
const likeController = new LikeController(likeService);

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API for managing likes on posts
 */

/**
 * @swagger
 * /api/likes:
 *   post:
 *     summary: Add a like to a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post to like
 *             required:
 *               - postId
 *     responses:
 *       201:
 *         description: Like added successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
likeRouter.post(
  "/",
  authenticateJWT,
  authorizationMiddleware("like_post"),
  likeController.createLike.bind(likeController)
);

/**
 * @swagger
 * /api/likes:
 *   delete:
 *     summary: Remove a like from a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post to remove the like from
 *             required:
 *               - postId
 *     responses:
 *       200:
 *         description: Like removed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
likeRouter.delete(
  "/",
  authenticateJWT,
  authorizationMiddleware("dislike_post"),
  likeController.removeLike.bind(likeController)
);

/**
 * @swagger
 * /api/likes/count/{postId}:
 *   get:
 *     summary: Get the total number of likes for a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: Number of likes for the post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of likes
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
likeRouter.get(
  "/count/:postId",
  authenticateJWT,
  authorizationMiddleware("read_post"),
  likeController.countLikes.bind(likeController)
);

export default likeRouter;

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The like ID
 *         postId:
 *           type: string
 *           description: The ID of the liked post
 *         userId:
 *           type: string
 *           description: The ID of the user who liked the post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the like was created
 *       example:
 *         id: "123"
 *         postId: "456"
 *         userId: "789"
 *         createdAt: "2024-12-06T00:00:00Z"
 */
