import { Router } from 'express';
import { UserService } from '../application/services/userService';
import { BanUserUseCase } from '../application/use-cases/BanUserUseCase';
import { AuthorizeUserUseCase } from '../application/use-cases/AuthorizeUserUseCase';
import { UserController } from '../infrastructure/controllers/UserController';
import { UserRepository } from '../infrastructure/repositories/UserRepository';

const router = Router();

const userRepository =  new UserRepository();
const userService = new UserService(userRepository);
const banUserUseCase = new BanUserUseCase(userService);
const authorizeUserUseCase = new AuthorizeUserUseCase(userService);
const userController = new UserController(userService, banUserUseCase, authorizeUserUseCase);

router.post('/users', (req, res) => userController.createUser(req, res));
router.get('/users/:id', (req, res) => userController.getUserById(req, res));
router.put('/users/:id', (req, res) => userController.updateUser(req, res));
router.delete('/users/:id', (req, res) => userController.deleteUser(req, res));
router.post('/users/ban/:id', (req, res) => userController.banUser(req, res));
router.post('/users/authorize', (req, res) => userController.authorizeUser(req, res));

export default router;