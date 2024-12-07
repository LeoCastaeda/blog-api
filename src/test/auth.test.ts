import { AuthService } from '../application/services/AuthService';
import { AuthController } from '../infrastructure/controllers/AuthController';
import { IUserRepository } from '../domain/repositories/IUserRepository'; // Import IUserRepository
import { Request, Response } from 'express';
import { Role, User } from '../domain/entities/User'; // Import User class

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(() => {
    const userRepository = {} as IUserRepository; // Mock or create an instance of IUserRepository
    authService = new AuthService(userRepository);
    authController = new AuthController(authService);
  });

  it('should assign the authService to the instance variable', () => {
    expect(authController['authService']).toBe(authService);
  });
});


describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    authService = new AuthService({} as IUserRepository);
    authController = new AuthController(authService);
    req = {} as Request;
    res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
  });
  it('should return 400 error when any of the required fields are missing', async () => {
    req.body = { username: 'test' };
    await authController.registrar(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Todos los campos son requeridos.' });
  });

  it('should return 201 success response with user data and token when all fields are present', async () => {
    req.body = { username: 'test', email: 'test@example.com', password: 'password', role: 'admin' };
    const user = User.with({
        id: 1,
        username: 'test',
        email: 'test@example.com',
        role: Role.Admin,
        password: 'hashedPassword',
        banned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    const token = 'token';
    jest.spyOn(authService, 'registrar').mockResolvedValue({ user, token });
    await authController.registrar(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuario registrado exitosamente.',
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  });

  it('should catch and return 400 error when authService.registrar function throws an error', async () => {
    req.body = { username: 'test', email: 'test@example.com', password: 'password', role: 'admin' };
    jest.spyOn(authService, 'registrar').mockRejectedValue(new Error('Error message'));
    await authController.registrar(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error message' });
  });
});

// Mock the AuthService class

jest.mock('../application/services/AuthService');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    authService = new AuthService({} as IUserRepository);
    authController = new AuthController(authService);
    req = {} as Request;
    res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
  });

  it('should return 400 error when email and password are missing', async () => {
    req.body = {};
    await authController.iniciarSesion(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correo y contraseña son requeridos.' });
  });

  it('should return 400 error when email is missing', async () => {
    req.body = { password: 'password' };
    await authController.iniciarSesion(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correo y contraseña son requeridos.' });
  });

  it('should return 400 error when password is missing', async () => {
    req.body = { email: 'email@example.com' };
    await authController.iniciarSesion(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Correo y contraseña son requeridos.' });
  });

  it('should return 200 success response when email and password are valid', async () => {
    req.body = { email: 'email@example.com', password: 'password' };
    const user = { id: 1, username: 'username', email: 'email@example.com', role: 'role' };
    const token = 'token';
    authService.iniciarSesion = jest.fn().mockResolvedValue({ user, token });
    await authController.iniciarSesion(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Inicio de sesión exitoso.',
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
      token,
    });
  });

  it('should return 401 error when email and password are invalid', async () => {
    req.body = { email: 'email@example.com', password: 'password' };
    authService.iniciarSesion = jest.fn().mockRejectedValue(new Error('Credenciales inválidas'));
    await authController.iniciarSesion(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales inválidas.' });
  });
});
describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;
    let req: Request;
    let res: Response;
    beforeEach(() => {
      authService = new AuthService({} as IUserRepository);
      authController = new AuthController(authService);
      req = {} as Request;
      res = {} as Response;
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn().mockReturnThis();
    });
    it('should return 400 error when token is not provided', async () => {
      req.headers = {};
      await authController.cerrarSesion(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Token no proporcionado.' });
    });
    it('should return 500 error when token is provided but invalid or malformed', async () => {
      req.headers = { authorization: 'invalid token' };
      jest.spyOn(authService, 'cerrarSesion').mockRejectedValue(new Error('Invalid token'));
      await authController.cerrarSesion(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al cerrar sesión.' });
    });
    it('should return 500 error when token is provided but error occurs during session closure', async () => {
      req.headers = { authorization: 'Bearer valid-token' };
      jest.spyOn(authService, 'cerrarSesion').mockRejectedValue(new Error('Error closing session'));
      await authController.cerrarSesion(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error al cerrar sesión.' });
    });
    it('should return 200 success response when token is provided and session closure is successful', async () => {
      req.headers = { authorization: 'Bearer valid-token' };
      jest.spyOn(authService, 'cerrarSesion').mockResolvedValue();
      await authController.cerrarSesion(req, res);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith({ message: 'Sesión cerrada exitosamente.' });
    });
  });
  
  
  
  
  
  
  
  
  