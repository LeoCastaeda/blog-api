import { Router } from 'express';
import { AuthController } from '../infrastructure/controllers/AuthController';
import { AuthService } from '../application/services/AuthService';
import { UserRepository } from '../infrastructure/repositories/UserRepository';

const authRoutes = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRoutes.post('/register', (req, res) => authController.registrar(req, res));
authRoutes.post('/login', (req, res) => authController.iniciarSesion(req, res));
authRoutes.post('/logout', (req, res) => authController.cerrarSesion(req, res));
authRoutes.post('/refresh', (req, res) => authController.refreshToken(req, res));

export default authRoutes;

