import { Injectable } from '@nestjs/common';
import { IPostService } from '../modules/blog/services/post/post.interface';
import { Post } from '../modules/blog/models/post';

@Injectable()
export class PostsService implements IPostService {
    get(filter: any, skip: number, take: number, orderBy: string, fields: string): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    add(post: Post): Promise<Post> {
        throw new Error("Method not implemented.");
    }
    update(post: Post, updateFields: string): Promise<Post> {
        throw new Error("Method not implemented.");
    }
    delete(post: Post): Promise<Post> {
        throw new Error("Method not implemented.");
    }
}
