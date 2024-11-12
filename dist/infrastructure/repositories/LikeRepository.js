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
exports.LikeRepository = void 0;
const Like_1 = require("../../domain/entities/Like");
const prismaClient_1 = __importDefault(require("../database/prismaClient"));
class LikeRepository {
    findById(id) {
        throw new Error('Method not implemented.');
    }
    findByUserId(userId) {
        throw new Error('Method not implemented.');
    }
    findByPostId(postId) {
        throw new Error('Method not implemented.');
    }
    countByPostId(postId) {
        throw new Error('Method not implemented.');
    }
    countByUserId(userId) {
        throw new Error('Method not implemented.');
    }
    save(like) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdLike = yield prismaClient_1.default.like.create({
                data: {
                    userId: like.userId,
                    postId: like.postId,
                    createdAt: like.createdAt,
                }
            });
            return Like_1.Like.with({
                id: createdLike.id,
                userId: createdLike.userId,
                postId: createdLike.postId,
                createdAt: createdLike.createdAt,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prismaClient_1.default.like.delete({ where: { id } });
        });
    }
}
exports.LikeRepository = LikeRepository;
