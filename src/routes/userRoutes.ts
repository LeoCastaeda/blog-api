import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authenticateJWT } from '../infrastructure/middlewares/authenticateJWT';
import { authorize } from '../infrastructure/middlewares/authorizeMiddleware';

const router = Router();

// Ruta para registro de usuario
router.post('/register', UserController.register);

// Ruta para login de usuario
router.post('/login', UserController.login);

// Ruta para obtener todos los usuarios
router.get('/users', authenticateJWT, authorize(['admin']), UserController.getAllUsers);

// Ruta para obtener un usuario por su ID
router.get('/users/:id', authenticateJWT, authorize(['admin', 'user']), UserController.getUserById);

// Ruta para actualizar un usuario
router.put('/users/:id', authenticateJWT, authorize(['admin', 'user']), UserController.updateUser);

// Ruta para eliminar un usuario
router.delete('/users/:id', authenticateJWT, authorize(['admin']), UserController.deleteUser);

export default router;
