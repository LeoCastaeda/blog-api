"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Like = void 0;
class Like {
    constructor(props) {
        this.props = props;
    }
    static create(userId, postId) {
        if (!userId)
            throw new Error("User ID is required");
        if (!postId)
            throw new Error("Post ID is required");
        return new Like({
            id: 0, // This should be set by the database
            userId,
            postId,
            createdAt: new Date(),
        });
    }
    static with(props) {
        if (!props.userId)
            throw new Error("User ID is required");
        if (!props.postId)
            throw new Error("Post ID is required");
        return new Like(props);
    }
    get id() {
        return this.props.id;
    }
    get userId() {
        return this.props.userId;
    }
    get postId() {
        return this.props.postId;
    }
    get createdAt() {
        return this.props.createdAt;
    }
}
exports.Like = Like;
