import { User } from '../entities/User';


export interface IUserRepository {
  findAll(): User[] | PromiseLike<User[]>;
  create(user: User): Promise<User>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  update(user: User, newData: Partial<User>): Promise<void>;
  delete(id: number): Promise<void>;
  banUser(userId: number): Promise<void>;
  unbanUser(userId: number): Promise<void>;
  updateEmail(userId: number, newEmail: string): Promise<void>;
}
export default IUserRepository;
