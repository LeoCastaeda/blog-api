import { User, Role } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import tokenService from "./tokenService";
import bcrypt from "bcryptjs";  

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
  ) {}

  async registrar(username: string, email: string, password: string, role: Role): Promise<User> {

    const hashedPassword = await bcrypt.hash(password, 10); 
    const user = User.create(username, email, hashedPassword, role);
    await this.userRepository.save(user);
    return user;
  }

  async iniciarSesion(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error("Nombre de usuario o contraseña incorrectos"); // Usuario no encontrado
    }

    // Compara las contraseñas con bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return tokenService.generateToken({ id: user.id, username: user.username });
    } else {
      throw new Error("Nombre de usuario o contraseña incorrectos"); // Contraseña incorrecta
    }
  }

  async cerrarSesion(token: string): Promise<void> {
    // Implementa la lógica para invalidar el token, como agregarlo a una lista negra
    // Puedes usar Redis o una base de datos para almacenar tokens inválidos.
  }

  async refrescarToken(token: string): Promise<string> {
    try {
      const decoded = tokenService.verifyToken(token); // Asumiendo que tokenService.verifyToken lanza un error si el token es inválido
      if (decoded && typeof decoded === 'object' && 'id' in decoded && 'username' in decoded) {
        return tokenService.generateToken(decoded);
      } else {
        throw new Error("Token inválido");
      }
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  }
}

export default AuthService;
