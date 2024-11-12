"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = exports.User = void 0;
const Role_1 = require("./Role");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return Role_1.Role; } });
const userEvents_1 = require("../events/userEvents");
const DomainEvents_1 = require("../events/DomainEvents");
class User {
    constructor(props) {
        this.props = props;
    }
    static create(username, email, password, role) {
        if (!username)
            throw new Error("Username is required");
        if (!email)
            throw new Error("Email is required");
        if (!password)
            throw new Error("Password is required");
        if (!Object.values(Role_1.Role).includes(role))
            throw new Error("Invalid role");
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
    static with(props) {
        return new User(props);
    }
    get id() {
        return this.props.id;
    }
    get username() {
        return this.props.username;
    }
    get email() {
        return this.props.email;
    }
    get password() {
        return this.props.password;
    }
    get role() {
        return this.props.role;
    }
    get banned() {
        return this.props.banned;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    updateEmail(newEmail) {
        if (!newEmail)
            throw new Error("Email is required");
        this.props.email = newEmail;
        this.props.updatedAt = new Date();
        // Trigger domain event
        DomainEvents_1.DomainEvents.dispatch(new userEvents_1.UserEmailUpdated(this.props.id, newEmail));
    }
    updatePassword(newPassword) {
        if (!newPassword)
            throw new Error("Password is required");
        this.props.password = newPassword;
        this.props.updatedAt = new Date();
        // Trigger domain event
        DomainEvents_1.DomainEvents.dispatch(new userEvents_1.UserPasswordUpdated(this.props.id, newPassword));
    }
    updateUsername(username) {
        if (!username)
            throw new Error("Username is required");
        this.props.username = username;
        this.updateUpdatedAt(new Date());
    }
    updateRole(role) {
        if (!Object.values(Role_1.Role).includes(role))
            throw new Error("Invalid role");
        this.props.role = role;
        this.updateUpdatedAt(new Date());
    }
    updateUpdatedAt(date) {
        this.props.updatedAt = date;
    }
    banUser() {
        this.props.banned = true;
        this.props.updatedAt = new Date();
        // Trigger domain event
        DomainEvents_1.DomainEvents.dispatch(new userEvents_1.UserBanned(this.props.id));
    }
    unbanUser() {
        this.props.banned = false;
        this.props.updatedAt = new Date();
        // Trigger domain event
        DomainEvents_1.DomainEvents.dispatch(new userEvents_1.UserUnbanned(this.props.id));
    }
}
exports.User = User;
