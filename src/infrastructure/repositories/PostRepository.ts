import { IPostRepository } from '../../domain/repositories/IPostRepository';
import { Post } from '../../domain/entities/Post';
import prisma from '../database/prismaClient';

export class PostRepository implements IPostRepository {
    async findById(id: number): Promise<Post | null> {
        const post = await prisma.post.findUnique({ where: { id } });
        return post ? Post.with({
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.authorId,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            deleted: post.deleted ?? false,
        }) : null;
    }

    async findAll(): Promise<Post[]> {
        const posts = await prisma.post.findMany({
            where: { deleted: false },
        });
        return posts.map((post) =>
            Post.with({
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.authorId,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                deleted: post.deleted,
            })
        );
    }

    async save(post: Post): Promise<void> {
        await prisma.post.create({
            data: {
                title: post.title,
                content: post.content,
                authorId: post.authorId,
                createdAt: post.createdAt ?? new Date(),
                updatedAt: post.updatedAt ?? new Date(),
            },
        });
    }

    async update(post: Post): Promise<void> {
        await prisma.post.update({
            where: { id: post.id },
            data: {
                title: post.title,
                content: post.content,
                updatedAt: new Date(),
            },
        });
    }

    async delete(id: number): Promise<boolean> {
        const result = await prisma.post.update({
            where: { id },
            data: { deleted: true },
        });
        return result !== null;
    }

    async countLikes(postId: number): Promise<number> {
        const count = await prisma.like.count({ where: { postId } });
        return count;
    }

    async likePost(postId: number, userId: number): Promise<void> {
        await prisma.like.create({
            data: {
                postId,
                userId,
            },
        });
    }

    async findUserPosts(userId: number): Promise<Post[]> {
        const posts = await prisma.post.findMany({
            where: { authorId: userId, deleted: false },
        });
        return posts.map((post) =>
            Post.with({
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.authorId,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                deleted: post.deleted,
            })
        );
    }
}