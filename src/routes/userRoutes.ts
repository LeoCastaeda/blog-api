// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserService } from '../application/services/userService';
import { BanUserUseCase } from '../application/use-cases/BanUserUseCase';
import { AuthorizeUserUseCase } from '../application/use-cases/AuthorizeUserUseCase';
import { UserController } from '../infrastructure/controllers/UserController';
import { UserRepository } from '../infrastructure/repositories/UserRepository';

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const banUserUseCase = new BanUserUseCase(userService);
const authorizeUserUseCase = new AuthorizeUserUseCase();
const userController = new UserController(userService, banUserUseCase, authorizeUserUseCase);

router.post('/users', userController.createUser.bind(userController));
router.get('/users/:id', userController.getUserById.bind(userController));
router.put('/users/:id', userController.updateUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));
router.post('/users/:id/ban', userController.banUser.bind(userController));
router.post('/users/:id/authorize', userController.authorizeUser.bind(userController));

export default router;