import { UserService } from '../services/userService';

export class LoginUser {
    constructor(private userService: UserService) {}
  
    async execute(email: string, password: string) {
      return this.userService.loginUser(email, password);
    }
  }