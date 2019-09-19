import { Controller, Get, Post, Delete, Put, Inject } from '@nestjs/common';
import { Request, Response } from "express";
import { IPostService } from '../../services/post/post.interface';

@Controller()
export class PostController {

    constructor(@Inject("IPostService") private postService: IPostService) {

    }

    @Get("blog/posts")
    public getPosts(req: Request, res: Response) {
        this.postService.get(req.query.filter, req.query.skip, req.query.take, req.query.orderBy, req.query.fields)
        .then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(400).send(err)
        })
    }

    @Post("blog/posts")
    public addPost(req: Request, res: Response) {
        this.postService.add(req.body)
        .then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(400).send(err)
        })
    }

    @Put("blog/posts")
    public updatePost(req: Request, res: Response) {
        this.postService.update(req.body, req.query.updateFields)
        .then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(400).send(err)
        })
    }

    @Delete("blog/posts/:id")
    public deletePost(req: Request, res: Response) {
        this.postService.delete({guid: req.params.id})
        .then(response => {
            res.status(200).send(response);
        }).catch(err => {
            res.status(400).send(err)
        })
    }

}
