import { Router } from "express";
import { AuthController } from "../infrastructure/controllers/AuthController";
import { AuthService } from "../application/services/AuthService";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { authenticateJWT } from "../infrastructure/middlewares/authenticateJWT";


const authRoutes = Router();

// Crear las dependencias del servicio y controlador
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: lucile
 *               email:
 *                 type: string
 *                 format: email
 *                 example: lucile@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *               role:
 *                 type: string
 *                 enum: [admin, simpleUser]
 *                 example: admin
 *             required:
 *               - username
 *               - email
 *               - password
 *               - role
 *               - createdAt
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
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
 *                   example: lucile
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: lucile@example.com
 *                 role:
 *                   type: string
 *                   example: admin
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-12-05T17:00:00Z
 *       400:
 *         description: Error de validación.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email is already in use."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
authRoutes.post("/register", authController.registrar.bind(authController));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión en la aplicación.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: lucile@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securePassword123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciales inválidas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid credentials."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
authRoutes.post("/login", authController.iniciarSesion.bind(authController));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cierra sesión en la aplicación.
 *     description: Cierra la sesión actual del usuario autenticado.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: [] # Indica que este endpoint requiere autenticación con token
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *              type: object
 *              properties:
 *                 message:
 *                   example: "Logged out successfully."
 *       401:
 *         description: Token inválido o no proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
authRoutes.post("/logout", authenticateJWT, authController.cerrarSesion.bind(authController));


/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Renueva el token de autenticación.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token renovado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Token inválido o no proporcionado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
authRoutes.post("/refresh-token", authenticateJWT, authController.refreshToken.bind(authController));

export default authRoutes;
