import { Controller, Get, Post, Put, Delete, Inject } from '@nestjs/common';
import { Request, Response } from "express";
import { ICommentService } from '../../services/comment/comment.interface';

@Controller()
export class CommentController {

    constructor(@Inject("ICommentService") private commentService: ICommentService) {

    }

    @Get("blog/posts/:id/comments")
    public getComments(req: Request, res: Response) {
        this.commentService.get(req.query.filter, req.query.skip, req.query.take, req.query.orderBy, req.query.fields)
        .then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(400).send(err)
        })
    }

    @Post("blog/posts/:id/comments")
    public addComment(req: Request, res: Response) {
        this.commentService.add(req.body)
        .then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(400).send(err)
        })
    }

    @Put("blog/posts/:id/comments/:comment_id")
    public updateComment(req: Request, res: Response) {
        this.commentService.add(req.body)
        .then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(400).send(err)
        })
    }

    @Delete("blog/posts/:id/comments/:comment_id")
    public deleteComment(req: Request, res: Response) {
        this.commentService.add(req.body)
        .then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(400).send(err)
        })
    }

}
