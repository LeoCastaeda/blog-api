import { User, Role } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import tokenService from "./tokenService";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}

  // Registro de usuario
  async registrar(
    username: string,
    email: string,
    password: string,
    role: Role
  ): Promise<{ user: User; token: string }> {
    // Verificar si el usuario o correo ya existen
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error("El correo electrónico ya está registrado");
    }

    const existingUserByUsername = await this.userRepository.findByUsername(
      username
    );
    if (existingUserByUsername) {
      throw new Error("El nombre de usuario ya está registrado");
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario y guardarlo
    const user = User.create(username, email, hashedPassword, role);
    await this.userRepository.save(user);

    // Generar token para el usuario registrado
    const token = tokenService.generateToken({ id: user.id, role: user.role });

    return { user, token };
  }

  // Inicio de sesión
  async iniciarSesion(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    // Buscar el usuario por correo
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Correo o contraseña incorrectos");
    }

    // Generar token de sesión
    const token = tokenService.generateToken({ id: user.id, role: user.role });

    return { user, token };
  }

  // Refrescar token
  async refrescarToken(token: string): Promise<string> {
    try {
      const decoded = tokenService.verifyToken(token);
      if (decoded && typeof decoded === "object" && "id" in decoded && "role" in decoded) {
        return tokenService.generateToken(decoded);
      } else {
        throw new Error("Token inválido");
      }
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  }

  // Cerrar sesión (ejemplo para lista negra de tokens)
  async cerrarSesion(token: string): Promise<void> {
    // Implementar lógica para agregar el token a una lista negra, si es necesario
    // Puedes usar Redis o una base de datos para almacenar los tokens inválidos.
  }
}

export default AuthService;
