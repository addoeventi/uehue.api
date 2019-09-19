import { Module } from '@nestjs/common';
import { CommentController } from './controllers/comment/comment.controller';
import { PostController } from './controllers/post/post.controller';
import { ICommentService } from './services/comment/comment.interface';
import { IPostService } from './services/post/post.interface';

@Module({
  controllers: [ PostController,CommentController]
})
export class BlogModule {

  static forRoot(options: { IPostService, ICommentService }){
 
     return{
       module: BlogModule,
       providers:[
        {
          provide: 'IPostService',
          useValue: options.IPostService
        },
        {
          provide: 'ICommentService',
          useValue: options.ICommentService
        }
       ]
     }
  }

}
