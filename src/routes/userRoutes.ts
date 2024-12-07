import { Router } from "express";
import { UserController } from "../infrastructure/controllers/UserController";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { authenticateJWT } from "../infrastructure/middlewares/authenticateJWT";
import authorizationMiddleware from "../infrastructure/middlewares/authorizeMiddleware";
import { UserService } from "../application/services/userService";

const userRoutes = Router();

// Crear las instancias necesarias
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: exampleUser
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: example@example.com
 *                   role:
 *                     type: string
 *                     example: simpleUser
 *                   banned:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-12-05T17:00:00Z
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2024-12-05T18:00:00Z
 *       401:
 *         description: No autorizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized.
 */
userRoutes.get(
  "/",
  authenticateJWT,
  authorizationMiddleware("read_all_users"),
  userController.getAllUsers.bind(userController)
);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del usuario.
 *     responses:
 *       200:
 *         description: Datos del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: exampleUser
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: example@example.com
 *                 role:
 *                   type: string
 *                   example: simpleUser
 *                 banned:
 *                   type: boolean
 *                   example: false
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-12-05T17:00:00Z
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-12-05T18:00:00Z
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: No autorizado.
 */
userRoutes.get(
  "/:id",
  authenticateJWT,
  authorizationMiddleware("read_user"),
  userController.findUserById.bind(userController)
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza el perfil de un usuario.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: updatedUser
 *               email:
 *                 type: string
 *                 format: email
 *                 example: updated@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: No autorizado.
 */
userRoutes.put(
  "/:id",
  authenticateJWT,
  authorizationMiddleware("update_profile"),
  userController.updateUserProfile.bind(userController)
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del usuario.
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: No autorizado.
 */
userRoutes.delete(
  "/:id",
  authenticateJWT,
  authorizationMiddleware("delete_user"),
  userController.deleteUser.bind(userController)
);

/**
 * @swagger
 * /api/users/{id}/ban:
 *   post:
 *     summary: Banea un usuario.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del usuario.
 *     responses:
 *       200:
 *         description: Usuario baneado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: No autorizado.
 */
userRoutes.post(
  "/:id/ban",
  authenticateJWT,
  authorizationMiddleware("ban_user"),
  userController.banUser.bind(userController)
);

/**
 * @swagger
 * /api/users/{id}/unban:
 *   post:
 *     summary: Desbanea un usuario.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del usuario.
 *     responses:
 *       200:
 *         description: Usuario desbaneado exitosamente.
 *       404:
 *         description: Usuario no encontrado.
 *       401:
 *         description: No autorizado.
 */
userRoutes.post(
  "/:id/unban",
  authenticateJWT,
  authorizationMiddleware("unban_user"),
  userController.unbanUser.bind(userController)
);

export default userRoutes;
