"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const User_1 = require("../../domain/entities/User");
const Role_1 = require("../../domain/entities/Role");
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
function mapPrismaRoleToRole(prismaRole) {
    switch (prismaRole) {
        case 'admin':
            return Role_1.Role.Admin;
        case 'simpleUser':
            return Role_1.Role.User;
        default:
            throw new Error(`Unknown role: ${prismaRole}`);
    }
}
function mapRoleToPrismaRole(role) {
    return role;
}
class UserRepository {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prismaClient_1.default.user.findUnique({ where: { id } });
            return user ? User_1.User.with({
                id: user.id,
                username: user.username,
                email: user.email,
                password: user.password,
                role: mapPrismaRoleToRole(user.role), // Cambiado aquí
                banned: user.banned,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }) : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prismaClient_1.default.user.findUnique({ where: { email } });
            return user ? User_1.User.with({
                id: user.id,
                username: user.username,
                email: user.email,
                password: user.password,
                role: mapPrismaRoleToRole(user.role), // Cambiado aquí
                banned: user.banned,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }) : null;
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield prismaClient_1.default.user.create({
                data: {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    role: mapRoleToPrismaRole(user.role), // Cambiado aquí
                    banned: user.banned,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                }
            });
            return User_1.User.with({
                id: createdUser.id,
                username: createdUser.username,
                email: createdUser.email,
                password: createdUser.password,
                role: mapPrismaRoleToRole(createdUser.role), // Cambiado aquí
                banned: createdUser.banned,
                createdAt: createdUser.createdAt,
                updatedAt: createdUser.updatedAt,
            });
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.default.user.update({
                where: { id: user.id },
                data: {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    role: mapRoleToPrismaRole(user.role), // Cambiado aquí
                    banned: user.banned,
                    updatedAt: user.updatedAt,
                }
            });
        });
    }
    update(user, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = Object.assign({}, newData);
            if (newData.role) {
                updateData.role = mapRoleToPrismaRole(newData.role);
            }
            yield prismaClient_1.default.user.update({
                where: { id: user.id },
                data: updateData,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.default.user.delete({ where: { id } });
        });
    }
    banUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.default.user.update({
                where: { id: userId },
                data: { banned: true },
            });
        });
    }
    unbanUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.default.user.update({
                where: { id: userId },
                data: { banned: false },
            });
        });
    }
    updateEmail(userId, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.default.user.update({
                where: { id: userId },
                data: { email: newEmail },
            });
        });
    }
}
exports.UserRepository = UserRepository;
