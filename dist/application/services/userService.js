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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../../domain/entities/User");
const tokenService_1 = __importDefault(require("./tokenService"));
class UserService {
    updateUserProfile(username, email, password, role) {
        throw new Error('Method not implemented.');
    }
    getAllUsers() {
        throw new Error('Method not implemented.');
    }
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    createUser(username, email, password, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = User_1.User.create(username, email, hashedPassword, role);
            const createdUser = yield this.userRepository.create(user);
            const token = tokenService_1.default.generateToken({ id: createdUser.id, role: createdUser.role });
            return { user: createdUser, token };
        });
    }
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (user && (yield bcrypt_1.default.compare(password, user.password))) {
                const token = tokenService_1.default.generateToken({ id: user.id, role: user.role });
                return { user, token };
            }
            throw new Error('Invalid email or password');
        });
    }
    updateUserEmail(userId, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.updateEmail(userId, newEmail);
        });
    }
    updateUserData(userId, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            if (newData.email) {
                user.updateEmail(newData.email);
            }
            if (newData.password) {
                const hashedPassword = yield bcrypt_1.default.hash(newData.password, 10);
                user.updatePassword(hashedPassword);
            }
            if (newData.username) {
                user.updateUsername(newData.username);
            }
            if (newData.role) {
                user.updateRole(newData.role);
            }
            if (newData.banned !== undefined) {
                if (newData.banned) {
                    user.banUser();
                }
                else {
                    user.unbanUser();
                }
            }
            user.updateUpdatedAt(new Date());
            // Now call the update method with both the user and the newData
            return this.userRepository.update(user, newData);
        });
    }
    banUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.banUser(userId);
        });
    }
    unbanUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.unbanUser(userId);
        });
    }
}
exports.UserService = UserService;
