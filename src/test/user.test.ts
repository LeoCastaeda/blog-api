import { UserController } from '../infrastructure/controllers/UserController';
import e, { Request, Response } from 'express';
import { UserService } from '../application/services/userService';
import { IUserRepository } from '../domain/repositories/IUserRepository'; // Adjust the path as necessary
import { UserBanned, UserPasswordUpdated } from '../domain/events/userEvents';
import { BanUserUseCase } from '../application/use-cases/BanUserUseCase';

jest.mock('../application/services/userService');
const mockedUserService = UserService as jest.Mocked<typeof UserService>;
(UserService.prototype.getAllUsers as jest.Mock).mockResolvedValue([]);
(UserService.prototype.findById as jest.Mock).mockResolvedValue(null);
(UserService.prototype.updateUserProfile as jest.Mock).mockResolvedValue(null);
(UserService.prototype.banUser as jest.Mock).mockResolvedValue(null);

describe('UserController', () => {
  let userController: UserController;
  let req: Request;
  let res: Response;

  let userService: UserService;
  
  beforeEach(() => {
    const userRepository = {} as IUserRepository; // Mock or create an instance of IUserRepository
    userService = new UserService(userRepository);
    userController = new UserController(userService);
    req = {} as Request;
    res = {} as Response;
    res.status = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
  });

  it('should return 403 for non-admin users', async () => {
    req.user = { id: 1, role: 'non-admin' };
    await userController.getAllUsers(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized action' });
  });

  it('should return 200 with all users for admin users', async () => {
    req.user = { id: 1, role: 'admin' };
    const users = [{ id: 1, username: 'user1' }, { id: 2, username: 'user2' }];
    (UserService.prototype.getAllUsers as jest.Mock).mockResolvedValue(users);
    await userController.getAllUsers(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(users);
  });

  it('should return 500 when fetching users fails', async () => {
    req.user = { id: 1, role: 'admin' };
    (UserService.prototype.getAllUsers as jest.Mock).mockRejectedValue(new Error('Failed to fetch users'));
    await userController.getAllUsers(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch users' });
  });
it('should return 400 for invalid user ID', async () => {
    req.params = { id: '' };
    await userController.findUserById(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID' });
  });
  it('should return 400 for non-numeric user ID', async () => {
    req.params = { id: 'abc' };
    await userController.findUserById(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID' });
  });
  it('should return 200 with user data for valid user ID', async () => {
    const user = { id: 1, username: 'test' };
    (UserService.prototype.findById as jest.Mock).mockResolvedValue(user);
    req.params = { id: '1' };
    await userController.findUserById(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(user);
  });
  it('should return 404 for non-existent user ID', async () => {
    (UserService.prototype.findById as jest.Mock).mockResolvedValue(null);
    req.params = { id: '1' };
    await userController.findUserById(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });
  it('should return 500 for error fetching user', async () => {
    (UserService.prototype.findById as jest.Mock).mockRejectedValue(new Error('Test error'));
    req.params = { id: '1' };
    req.user = { id: 1, role: 'admin' }; // Ensure the user is authorized
    await userController.findUserById(req, res);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch user' });
  });
    it('should return 500 for invalid user ID', async () => {
        req.params = { id: '' };
        await userController.updateUserProfile(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update user profile' });
    });
    it('should return 400 for non-numeric user ID', async () => {
        req.params = { id: 'abc' };
        await userController.updateUserProfile(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update user profile' });
    });
    it('should return 403 for unauthorized user', async () => {
        req.params = { id: '1' };
        req.body = { username: 'test', email: 'ZL6Z7@example.com', password: 'testpassword' };
        req.user = { id: 2, role: 'non-admin' }; // Mock unauthorized user
        await userController.updateUserProfile(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized action' });
    });
    it('should return 500 for error updating user profile', async () => {
        req.params = { id: '1' };
        req.body = { username: 'test', email: 'ZL6Z7@example.com', password: 'testpassword' };
        (UserService.prototype.updateUserProfile as jest.Mock).mockRejectedValue(new Error('Test error'));
        await userController.updateUserProfile(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to update user profile' });
    });
    it('should return 200 with updated user profile', async () => {
        const updatedUser = { id: 1, username: 'test', email: 'ZL6Z7@example.com', password: 'testpassword' };
        (UserService.prototype.updateUserProfile as jest.Mock).mockResolvedValue(updatedUser);
        req.params = { id: '1' };
        req.user = { id: 1, role: 'admin' }; // Ensure the user is authorized
        req.body = { username: 'test', email: 'ZL6Z7@example.com', password: 'testpassword' };
        await userController.updateUserProfile(req, res);    
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);    
        expect(res.json).toHaveBeenCalledTimes(1);    
        expect(res.json).toHaveBeenCalledWith(updatedUser);    
    });
    it('should return 403 for non-admin role', async () => {
        req.user = { id: 1, role: 'user' };
        await userController.banUser(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized action' });
      });
      it('should return 400 for invalid user ID', async () => {
        req.user = { id: 1, role: 'admin' };
        req.params = { id: 'abc' };
        await userController.banUser(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID' });
      });
      it('should successfully ban user', async () => {
        req.user = { id: 1, role: 'admin' };
        req.params = { id: '1' };
        userService.banUser = jest.fn().mockResolvedValue(BanUserUseCase);
        await userController.banUser(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ message: 'User banned successfully' });
      });
      it('should handle error from userService.banUser', async () => {
        req.user = { id: 1, role: 'admin' };
        req.params = { id: '1' };
        userService.banUser = jest.fn().mockRejectedValue(new Error('Test error'));
        await userController.banUser(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to ban user' });
      });
      it('should return 403 for non-admin role', async () => {
        req.user = { id: 1, role: 'user' };
        await userController.unbanUser(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized action' });
      });
      it('should return 400 for invalid user ID', async () => {
        req.user = { id: 1, role: 'admin' };
        req.params = { id: 'abc' };
        await userController.unbanUser(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid user ID' });
      });
      it('should successfully unban user', async () => {
        req.user = { id: 1, role: 'admin' };
        req.params = { id: '1' };
        userService.unbanUser = jest.fn().mockResolvedValue(UserBanned);
        await userController.unbanUser(req, res);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);    
        expect(res.json).toHaveBeenCalledTimes(1);    
        expect(res.json).toHaveBeenCalledWith({ message: 'User unbanned successfully' });
        });
        it('should handle error from userService.unbanUser', async () => {
          req.user = { id: 1, role: 'admin' };
          req.params = { id: '1' };
          userService.unbanUser = jest.fn().mockRejectedValue(new Error('Test error'));
          await userController.unbanUser(req, res);
          expect(res.status).toHaveBeenCalledTimes(1);
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledTimes(1);
          expect(res.json).toHaveBeenCalledWith({ error: 'Failed to unban user' });
        })       
  
  

});
 
  