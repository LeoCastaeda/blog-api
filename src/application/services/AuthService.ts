import { User, Role } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import tokenService from "./tokenService";

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
  ) {}

  async registrar(username: string, email: string, password: string, role: Role): Promise<User> {
    const user = User.create(username, email, password, role);
    await this.userRepository.save(user);
    return user;
  }

  async iniciarSesion(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findByUsername(username);
    if (user instanceof User && user.password === password) {
      return tokenService.generateToken({ id: user.id, username: user.username });
    } else {
      throw new Error("Nombre de usuario o contraseña incorrectos");
    }
  }

  async cerrarSesion(token: string): Promise<void> {
    // Implementa la lógica para invalidar el token, como agregarlo a una lista negra
  }

  async refrescarToken(token: string): Promise<string> {
    const decoded = tokenService.verifyToken(token);
    if (decoded && typeof decoded === 'object' && 'id' in decoded && 'username' in decoded) {
      return tokenService.generateToken(decoded);
    } else {
      throw new Error("Token inválido");
    }
  }
}

export default AuthService;