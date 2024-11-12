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
            deleted: false
        }): null;
    }

    async findAll(): Promise<Post[]> {
        const posts = await prisma.post.findMany();
        return posts.map((post) => Post.with({
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.authorId,                            
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            deleted: post.deleted,
        }));
    }

    async save(post: Post): Promise<void> {
        await prisma.post.create({
            data: {
                id: post.id,
                title: post.title,
                content: post.content,
                authorId: post.authorId,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            },
        }); 
    }

    async update(post: Post): Promise<void> {
        await prisma.post.update({
            where: { id: post.id },
            data: {
                title: post.title,
                content: post.content,
                updatedAt: post.updatedAt,
            },
        });
    }

    async delete(id: number): Promise<void> {
        await prisma.post.delete({ where: { id } });
    }
}