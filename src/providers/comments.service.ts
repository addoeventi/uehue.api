import { Injectable } from '@nestjs/common';
import { ICommentService } from '../modules/blog/services/comment/comment.interface';
import { Comment } from '../modules/blog/models/comment';

@Injectable()
export class CommentsService implements ICommentService {
    get(filter: any, skip: number, take: number, orderBy: string, fields: string): Promise<Comment[]> {
        throw new Error("Method not implemented.");
    }
    add(comment: Comment): Promise<Comment> {
        throw new Error("Method not implemented.");
    }
    update(comment: Comment, updateFields: string): Promise<Comment> {
        throw new Error("Method not implemented.");
    }
    delete(comment: Comment): Promise<Comment> {
        throw new Error("Method not implemented.");
    }
}
