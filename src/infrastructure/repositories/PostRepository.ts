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
            deleted: post.deleted ?? false, // Si `deleted` no es nulo/indefinido
        }) : null;
    }

    async findAll(): Promise<Post[]> {
        const posts = await prisma.post.findMany({
            where: { deleted: false }, // Solo publicaciones no eliminadas
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
                updatedAt: new Date(), // Actualizar la fecha de modificación
            },
        });
    }

    async delete(id: number): Promise<void> {
        // Implementación de soft delete
        await prisma.post.update({
            where: { id },
            data: { deleted: true },
        });
    }
}
