import { Post } from '../../domain/entities/Post';
import { PostService } from '../services/postService';

export class EditPost {
    constructor(private postService: PostService) {}

    async execute(post: Post): Promise<void> {
        return this.postService.updatePost(post);   

    }
}