import { User, Role } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import tokenService from "../services/tokenService";
import bcrypt from "bcryptjs";

export class AuthService {
  constructor(private userRepository: IUserRepository) {}
 
  async registrar(
    username: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ user: User; token: string }> {
     
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new Error("El correo ya está registrado.");
    }

     
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new Error("El nombre de usuario ya está registrado");
    }

     
    const hashedPassword = await bcrypt.hash(password, 10);

     
    const userRole = role === 'admin' ? Role.Admin : Role.SimpleUser;
    const user = await this.userRepository.create(
      User.create(username, email, hashedPassword, userRole)
    );

     
    const token = tokenService.generateToken({ id: user.id, role: user.role });

    return { user, token };
  }

   
  async iniciarSesion(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
     
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("Correo o contraseña incorrectos");
    }

     
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Correo o contraseña incorrectos");
    }

     
    const token = tokenService.generateToken({ id: user.id, role: user.role });

    return { user, token };
  }
   
  async cerrarSesion(token: string): Promise<void> {
    try {
      
      const decoded = tokenService.verifyToken(token);

      if (decoded && typeof decoded === "object" && "id" in decoded && "role" in decoded) {
         
        tokenService.addToBlacklist(token);
      } else {
        throw new Error("Token inválido");
      }
    } catch (error) {
      throw new Error("Token inválido o expirado");
    }
  }

   
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

  
}

export default AuthService;
