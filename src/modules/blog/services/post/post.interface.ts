import { Post } from "../../models/post";

export interface IPostService {
    get(filter: any, skip: number, take: number, orderBy: string, fields: string): Promise<Post[]>
    add(post: Post): Promise<Post> 
    update(post: Post, updateFields: string): Promise<Post> 
    delete(post: Post): Promise<Post>
}