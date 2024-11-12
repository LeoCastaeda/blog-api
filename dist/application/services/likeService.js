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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const Like_1 = require("../../domain/entities/Like");
class LikeService {
    constructor(likeRepository) {
        this.likeRepository = likeRepository;
    }
    addLike(userId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const like = Like_1.Like.create(userId, postId);
            yield this.likeRepository.save(like);
            return like;
        });
    }
    removeLike(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.likeRepository.delete(id);
        });
    }
    getLikesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.likeRepository.findByUserId(userId);
        });
    }
    getLikesByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.likeRepository.findByPostId(postId);
        });
    }
    countLikesByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.likeRepository.countByPostId(postId);
        });
    }
    countLikesByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.likeRepository.countByUserId(userId);
        });
    }
}
exports.LikeService = LikeService;
exports.default = LikeService;
