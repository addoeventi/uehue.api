import { Body, Controller, Post, UploadedFiles, UseInterceptors, Req, Get, Query, Put, Delete, Res, Param } from '@nestjs/common';
import { DocumentProject } from '../../database/models';
import { FilesInterceptor, FileFieldsInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { ExtRequest } from '../../../extended/types.extended';
import { ProjectsProvider } from '../../providers/projects.provider';
import { Response } from 'express';
import { RequestMiddleware } from '../../middleware/request.middleware';
import { Global } from '../../providers/global';
import { newGuid } from 'ts-guid';
const fs = require('fs');
const path = require('path');


@Controller('projects')
export class ProjectsController {

    constructor(private projectsProvider: ProjectsProvider) {

    }

    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    post(@UploadedFiles() files, @Body() body: DocumentProject, @Req() req: ExtRequest, @Res() res: Response) {
        try {
            body['team'] = JSON.parse(body['team'] as any);
        }
        catch (e) { }

        for (let file of (files || [])) {
            const filename = newGuid() + '.' + file.originalname.split('.').pop();
            const filePath = path.resolve(__dirname, 'uploads', filename);
            try {
                fs.writeFileSync(filePath, file.buffer);
                if (file.fieldname == "cover") {
                    body.cover = Global.ENDPOINT +"/projects/image?image=" + filename;
                } else {
                    body.files.push({ path: filePath, name: file.originalname });
                }
            } catch (err) {
            }
        }

        this.projectsProvider.post(files, body, req.identity).then(result => {
            res.status(200).send(result)
        }).catch(err => {
            console.error(err);
            res.status(400).send({ err: err, message: err.message });
        });
    }

    @Post()
    @UseInterceptors(FilesInterceptor('files[]'))
    postImages(@UploadedFiles() files, @Body() body: DocumentProject, @Req() req: ExtRequest, @Res() res: Response) {

        if (fs.existsSync(path.resolve(__dirname, 'uploads')) === false) {
            fs.mkdirSync(path.resolve(__dirname, 'uploads'));
        }

        const errors = [];

        let filename = Date.now() + '.' + files[0].originalname.split('.').pop()

        const filePath = path.resolve(__dirname, 'uploads', filename);
        try {
            fs.writeFileSync(filePath, files[0].buffer);
        } catch (err) {
            errors.push({ err, file: files[0].originalname });
        }

        res.status(200).send({ "url": Global.ENDPOINT + "/projects/image?image=" + filename })
    }

    @Get('image')
    getImage(@Req() req: ExtRequest, @Res() res: Response) {

        let dir = path.resolve(__dirname, 'uploads', req.query.image);

        // var img = fs.readFileSync(dir);
        // res.writeHead(200, {
        //     'Content-Type': "image/jpeg",
        //     'Content-Length': img.length
        // });
        // res.end(img);

        res.status(200).sendFile(dir);
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

    @Put(':guid/status')
    setStatus(@Res() res: Response, @Param('guid') guid, @Body() body) {
        this.projectsProvider.setStatus(guid, body.status).then(f => {
            //
            res.status(200).send(f)
        }).catch(
            err => {
                console.error(err);
                res.status(400).send(err);
            }
        )
    }

    @Put()
    @UseInterceptors(AnyFilesInterceptor())
    put(@UploadedFiles() files, @Body() body: DocumentProject, @Req() req: ExtRequest, @Res() res: Response) {
        try {
            body['team'] = JSON.parse(body['team'] as any);
        }
        catch (e) {
            console.error(e);
        }
        
        for (let file of (files || [])) {
            const filename = newGuid() + '.' + file.originalname.split('.').pop();
            const filePath = path.resolve(__dirname, 'uploads', filename);
            try {
                fs.writeFileSync(filePath, file.buffer);
                if (file.fieldname == "cover") {
                    body.cover = Global.ENDPOINT + "/projects/image?image=" + filename;
                }
            } catch (err) {
            }
        }

        this.projectsProvider.update(files, body, req.identity).then(f => {
            //
            res.status(200).send(f)
        }).catch(
            err => {
                console.error(err);
                res.status(400).send(err);
            }
        );
    }

    @Put(':guid/review')
    update(@Param('guid') guid, @Body('guid') reviewId, @Body() body) {
        return this.projectsProvider.review(guid, reviewId, body);
    }

    @Delete('/:guid')
    delete(@Param('guid') guid, @Req() req) {
        return this.projectsProvider.delete(guid, req);
    }

    @Get('file/download')
    file(@Query('guid') guid, @Query('name') name, @Query('tk') tk, @Req() req: ExtRequest, @Res() res: Response) {

        RequestMiddleware.SetIdentity(tk, req);

        if (req.identity == null) {
            res.status(401).send({ error: 'UNAUTHORIZED', message: 'UNAUTHORIZED', statusCode: 401 });
            return;
        }

        res.setHeader('Content-disposition', 'attachment; filename=' + name);
        res.sendFile(this.projectsProvider.sendFile(guid));
    }
}
