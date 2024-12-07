import { User, Role } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import tokenService from "../services/tokenService";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Registro de usuario
   */
  async registrar(
    username: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ user: User; token: string }> {
    // Verificar si el correo ya está registrado
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error("El correo ya está registrado.");
    }

    // Verificar si el nombre de usuario ya está registrado
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error("El nombre de usuario ya está registrado");
    }

    // Hashear la contraseña antes de guardar
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario y guardarlo
    const userRole = role === 'admin' ? Role.Admin : Role.SimpleUser;
    const user = await this.userRepository.create(
      User.create(username, email, hashedPassword, userRole)
    );

    // Generar un token JWT para el usuario
    const token = tokenService.generateToken({ id: user.id, role: user.role });

    return { user, token };
  }

  /**
   * Inicio de sesión
   */
  async iniciarSesion(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // Buscar el usuario por correo
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Verificar que la contraseña es válida
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Generar un token JWT para la sesión
    const token = tokenService.generateToken({ id: user.id, role: user.role });

    return { user, token };
  }
  /**
   * Cerrar sesión (ejemplo con lista negra de tokens)
   */
  async cerrarSesion(token: string): Promise<void> {
    try {
      // Verificar y decodificar el token
      const decoded = tokenService.verifyToken(token);

      if (decoded && typeof decoded === "object" && "id" in decoded && "role" in decoded) {
        // Agregar el token a la lista negra
        tokenService.addToBlacklist(token);
      } else {
        throw new Error("Token inválido");
      }
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  }

  /**
   * Refrescar el token
   */
  async refrescarToken(token: string): Promise<string> {
    try {
      // Verificar y decodificar el token existente
      const decoded = tokenService.verifyToken(token);

      if (decoded && typeof decoded === "object" && "id" in decoded && "role" in decoded) {
        // Generar un nuevo token con la misma información
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
