import { Router } from "express";
import { UserController } from "../infrastructure/controllers/UserController";
import { UserService } from "../application/services/userService";
import { BanUserUseCase } from "../application/use-cases/BanUserUseCase";
import { AuthorizeUserUseCase } from "../application/use-cases/AuthorizeUserUseCase";
import { UserRepository } from "../infrastructure/repositories/UserRepository";

const userRoutes = Router();

// Crear instancias de las dependencias
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const banUserUseCase = new BanUserUseCase(userService);
const authorizeUserUseCase = new AuthorizeUserUseCase();
const userController = new UserController(userService, banUserUseCase, authorizeUserUseCase);

userRoutes.get("/", (req, res) => userController.getAllUsers(req, res));

// Definir las rutas

userRoutes.get("/:id", (req, res) => userController.getUserById(req, res));
userRoutes.put("/:id", (req, res) => userController.updateUser(req, res));
userRoutes.delete("/:id", (req, res) => userController.deleteUser(req, res));
userRoutes.post("/:id/ban", (req, res) => userController.banUser(req, res));
userRoutes.post("/:id/unban", (req, res) => userController.unbanUser(req, res));
userRoutes.post("/:id/authorize", (req, res, next) => userController.authorizeUser(req, res, next));

export default userRoutes;
