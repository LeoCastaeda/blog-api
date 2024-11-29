import { Router } from "express";
import { UserController } from "../infrastructure/controllers/UserController";
import { UserService } from "../application/services/userService";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { authenticateJWT } from '../infrastructure/middlewares/authenticateJWT';
import authorizationMiddleware from '../infrastructure/middlewares/authorizeMiddleware';

const userRoutes = Router();

// Crear instancias de las dependencias
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

userRoutes.get("/", authenticateJWT, authorizationMiddleware('read_all_users'), (req, res) => userController.getAllUsers(req, res));
userRoutes.get("/:id", authenticateJWT, authorizationMiddleware('read_user'), (req, res) => userController.getUserById(req, res));
userRoutes.put("/:id", authenticateJWT, authorizationMiddleware('update_own_profile'), (req, res) => userController.updateUser(req, res));
userRoutes.delete("/:id", authenticateJWT, authorizationMiddleware('delete_user'), (req, res) => userController.deleteUser(req, res));
userRoutes.post("/:id/ban", authenticateJWT, authorizationMiddleware('ban_user'), (req, res) => userController.banUser(req, res));
userRoutes.post("/:id/unban", authenticateJWT, authorizationMiddleware('unban_user'), (req, res) => userController.unbanUser(req, res));


export default userRoutes;
