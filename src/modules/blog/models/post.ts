export class Post {
    public guid: string;
    public title?: string = '';
    public content?: string = '';
    public comments?: Comment[] = [];
}