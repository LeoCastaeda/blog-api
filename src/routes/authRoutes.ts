import { Router } from "express";
import { AuthController } from "../infrastructure/controllers/AuthController";
import { AuthService } from "../application/services/AuthService";
import { UserRepository } from "../infrastructure/repositories/UserRepository";


const authRoutes = Router();

// Crear instancias de las dependencias
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Definir las rutas
authRoutes.post("/register", (req, res) => authController.registrar(req, res));
authRoutes.post("/login", (req, res) => authController.iniciarSesion(req, res));
authRoutes.post("/logout", (req, res) => authController.cerrarSesion(req, res));
authRoutes.post("/refresh-token", (req, res) => authController.refreshToken(req, res));

export default authRoutes;

