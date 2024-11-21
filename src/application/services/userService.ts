import bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User, Role, UserProps } from '../../domain/entities/User';
import tokenService from './tokenService';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  // Crear un nuevo usuario
  async createUser(username: string, email: string, password: string, role: Role) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hasheamos la contraseña
    const user = User.create(username, email, hashedPassword, role); // Usamos el método de creación del modelo
    const createdUser = await this.userRepository.create(user); // Guardamos al usuario en la base de datos
    const token = tokenService.generateToken({ id: createdUser.id, role: createdUser.role }); // Generamos un token
    return { user: createdUser, token }; // Retornamos el usuario y el token
  }

  // Iniciar sesión
  async loginUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email); // Buscamos al usuario por correo
    if (user && (await bcrypt.compare(password, user.password))) { // Comparamos la contraseña
      const token = tokenService.generateToken({ id: user.id, role: user.role }); // Generamos un token
      return { user, token }; // Retornamos el usuario y el token
    }
    throw new Error('Invalid email or password'); // Si el correo o la contraseña son incorrectos, lanzamos un error
  }

  // Obtener todos los usuarios
  async getAllUsers() {
    return this.userRepository.findAll(); // Recuperamos todos los usuarios
  }

  // Obtener un usuario por su ID
  async findById(userId: number) {
    const user = await this.userRepository.findById(userId); // Buscamos el usuario por su ID
    if (!user) {
      throw new Error('User not found'); // Si no existe, lanzamos un error
    }
    return user; // Retornamos el usuario
  }

  // Actualizar el perfil del usuario
  async updateUserProfile(userId: number, username: string, email: string, password: string, role: Role) {
    const hashedPassword = await bcrypt.hash(password, 10); // Hasheamos la nueva contraseña
    const updates: Partial<UserProps> = { username, email, password: hashedPassword, role }; // Creamos el objeto con los datos a actualizar
    return this.updateUserData(userId, updates); // Llamamos a la función para actualizar los datos
  }

  // Actualizar los datos del usuario (Generalizado)
  async updateUserData(userId: number, newData: Partial<UserProps>) {
    const user = await this.userRepository.findById(userId); // Buscamos al usuario por ID
    if (!user) {
        throw new Error('User not found'); // Si no existe, lanzamos un error
    }
    return this.userRepository.update(user, newData); // Actualizamos los datos del usuario
  }

  // Actualizar el correo del usuario
  async updateUserEmail(userId: number, newEmail: string) {
    return this.userRepository.updateEmail(userId, newEmail); // Usamos el repositorio para actualizar el correo
  }

  // Banear un usuario
  async banUser(userId: number) {
    return this.userRepository.banUser(userId); // Usamos el repositorio para banear al usuario
  }

  // Desbanear un usuario
  async unbanUser(userId: number) {
    return this.userRepository.unbanUser(userId); // Usamos el repositorio para desbanear al usuario
  }

  // Eliminar un usuario
  async deleteUser(userId: number) {
    const user = await this.userRepository.findById(userId); // Buscamos al usuario por ID
    if (!user) {
      throw new Error('User not found'); // Si no existe, lanzamos un error
    }
    return this.userRepository.delete(userId); // Eliminamos al usuario
  }
}
