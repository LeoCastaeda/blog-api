"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(props) {
        this.props = props;
    }
    static create(title, content, authorId) {
        if (!title)
            throw new Error("Title is required");
        if (!content)
            throw new Error("Content is required");
        if (!authorId)
            throw new Error("Author ID is required");
        return new Post({
            id: 0, // This should be set by the database
            title,
            content,
            authorId,
            createdAt: new Date(),
            updatedAt: new Date(),
            deleted: false,
        });
    }
    static with(props) {
        return new Post(props);
    }
    get id() {
        return this.props.id;
    }
    get title() {
        return this.props.title;
    }
    get content() {
        return this.props.content;
    }
    get authorId() {
        return this.props.authorId;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get deleted() {
        return this.props.deleted;
    }
    updateTitle(title) {
        if (!title)
            throw new Error("Title cannot be empty");
        this.props.title = title;
        this.props.updatedAt = new Date();
    }
    updateContent(content) {
        if (!content)
            throw new Error("Content cannot be empty");
        this.props.content = content;
        this.props.updatedAt = new Date();
    }
    softDelete() {
        this.props.deleted = true;
        this.props.updatedAt = new Date();
    }
    unDelete() {
        this.props.deleted = false;
        this.props.updatedAt = new Date();
    }
}
exports.Post = Post;
