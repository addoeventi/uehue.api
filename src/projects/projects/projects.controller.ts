import {
    Body,
    Controller,
    UploadedFile,
    Inject,
    Post,
    UploadedFiles,
    UseInterceptors,
    Req,
    Get,
    Query, Put, Delete, Res, Param,
} from '@nestjs/common';
import {DocumentProject} from '../../database/models';
import { FilesInterceptor } from '@nestjs/platform-express';
import {ExtRequest} from '../../../extended/types.extended';
import {ProjectsProvider} from '../../providers/projects.provider';
import { Response } from 'express';
import {RequestMiddleware} from '../../middleware/request.middleware';

@Controller('projects')
export class ProjectsController {

    constructor(private projectsProvider: ProjectsProvider) {

    }

    @Post()
    @UseInterceptors(FilesInterceptor('files[]'))
    post(@UploadedFiles() files, @Body() body: DocumentProject, @Req() req: ExtRequest, @Res() res: Response) {
        this.projectsProvider.post(files, body, req.identity).then(result => {
            return result;
        }).catch(err => {
            res.status(400).send(err);
        });
    }

    @Get()
    get(@Req() req: ExtRequest) {
        return this.projectsProvider.get(req);
    }

    @Get('reviews/:guid')
    reviews(@Param('guid') guid, @Req() req: ExtRequest) {
        return this.projectsProvider.getById(guid, req);
    }

    @Get('/:guid')
    getById(@Param('guid') guid, @Req() req: ExtRequest) {
        return this.projectsProvider.getById(guid, req);
    }

    @Put()
    @UseInterceptors(FilesInterceptor('files[]'))
    put(@UploadedFiles() files, @Body() body: DocumentProject, @Req() req: ExtRequest) {
        return this.projectsProvider.update(files, body, req.identity);
    }
    
    @Put(':guid/review/:review_id')
    update(@Param('guid') guid, @Param('review_id') reviewId, @Body() body) {
        return this.projectsProvider.review(guid, reviewId, body);
    }

    @Delete('/:guid')
    delete(@Query('guid') guid, @Req() req) {
        return this.projectsProvider.delete(guid, req);
    }

    @Get('file')
    file(@Query('guid') guid, @Query('name') name, @Query('tk') tk, @Req() req: ExtRequest, @Res() res: Response) {

        RequestMiddleware.SetIdentity(tk, req);

        if (req.identity == null) {
            res.status(401).send({
                error: 'UNAUTHORIZED',
                message: 'UNAUTHORIZED',
                statusCode: 401,
            });

            return;
        }

        res.setHeader('Content-disposition', 'attachment; filename=' + name);
        res.sendFile(this.projectsProvider.sendFile(guid));
    }
}
