import { Role } from './Role';
import { UserEmailUpdated, UserPasswordUpdated, UserBanned, UserUnbanned } from '../events/userEvents';
import { DomainEvents } from '../events/DomainEvents';

export type UserProps = {
  id: number;
  username: string;
  email: string;
  password: string;
  role: Role;
  banned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private props: UserProps) { }

  public static create(username: string, email: string, password: string, role: Role): User {
    if (!username) throw new Error("Username is required");
    if (!email) throw new Error("Email is required");
    if (!password) throw new Error("Password is required");
    if (!Object.values(Role).includes(role)) throw new Error("Invalid role");

    return new User({
      id: 0,
      username,
      email,
      password,
      role,
      banned: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public static with(props: UserProps): User {
    return new User(props);
  }

  public get id() {
    return this.props.id;
  }

  public get username() {
    return this.props.username;
  }

  public get email() {
    return this.props.email;
  }

  public get password() {
    return this.props.password;
  }

  public get role() {
    return this.props.role;
  }

  public get banned() {
    return this.props.banned;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public updateEmail(newEmail: string) {
    if (!newEmail) throw new Error("Email is required");
    this.props.email = newEmail;
    this.props.updatedAt = new Date();
    // Trigger domain event
    DomainEvents.dispatch(new UserEmailUpdated(this.props.id, newEmail));
  }

  public updatePassword(newPassword: string) {
    if (!newPassword) throw new Error("Password is required");
    this.props.password = newPassword;
    this.props.updatedAt = new Date();
    // Trigger domain event
    DomainEvents.dispatch(new UserPasswordUpdated(this.props.id, newPassword));
  }
  public updateUsername(username: string) {
    if (!username) throw new Error("Username is required");
    this.props.username = username;
    this.updateUpdatedAt(new Date());
  }

  public updateRole(role: Role) {
    if (!Object.values(Role).includes(role)) throw new Error("Invalid role");
    this.props.role = role;
    this.updateUpdatedAt(new Date());
  }

  public updateUpdatedAt(date: Date) {
    this.props.updatedAt = date;
  }


  public banUser() {
    this.props.banned = true;
    this.props.updatedAt = new Date();
    // Trigger domain event
    DomainEvents.dispatch(new UserBanned(this.props.id));
  }

  public unbanUser() {
    this.props.banned = false;
    this.props.updatedAt = new Date();
    // Trigger domain event
    DomainEvents.dispatch(new UserUnbanned(this.props.id));
  }
}

export { Role };
