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
exports.PostService = void 0;
const Post_1 = require("../../domain/entities/Post");
class PostService {
    countLikes(postId) {
        throw new Error('Method not implemented.');
    }
    likePost(postId, userId) {
        throw new Error('Method not implemented.');
    }
    getUserPosts(userId) {
        throw new Error('Method not implemented.');
    }
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    createPost(title, content, authorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = Post_1.Post.create(title, content, authorId);
            yield this.postRepository.save(post);
            return post;
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepository.findById(id);
        });
    }
    getAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postRepository.findAll();
        });
    }
    updatePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.postRepository.update(post);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.postRepository.delete(id);
        });
    }
}
exports.PostService = PostService;
exports.default = PostService;
