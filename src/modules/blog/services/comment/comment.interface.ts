import { Comment } from "../../models/comment";

export interface ICommentService {
    get(filter: any, skip: number, take: number, orderBy: string, fields: string): Promise<Comment[]>
    add(comment: Comment): Promise<Comment> 
    update(comment: Comment, updateFields: string): Promise<Comment> 
    delete(comment: Comment): Promise<Comment>
}