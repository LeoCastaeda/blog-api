import { User } from '../entities/User';


export interface IUserRepository {
  findAll(): User[] | Promise<User[]>;
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User, newData: Partial<User>): Promise<void>;
  delete(id: number): Promise<void>;
  banUser(userId: number): Promise<void>;
  unbanUser(userId: number): Promise<void>;
  updateEmail(userId: number, newEmail: string): Promise<void>;
  countUsers(): Promise<number>;
}
export default IUserRepository;
