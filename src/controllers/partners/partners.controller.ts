import { Controller, Get, Req, Post, Put, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ExtRequest } from 'extended/types.extended';
import { PartnerProvider } from '../../providers/partners.provider';
import { newGuid } from 'ts-guid';
import * as fs from "fs";
import * as path from "path";
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Global } from '../../providers/global';

@Controller()
export class PartnersController {
    constructor(private partnersProvider: PartnerProvider) {

    }

    @Get('partners')
    getPartners(@Req() req: ExtRequest) {
        req.filters = { $and: [{ type: "partner" }, req.filters] }
        return this.partnersProvider.get(req);
    }

    @Get('stakeholders')
    getStakeholders(@Req() req: ExtRequest) {
        req.filters = { $and: [{ type: "stakeholder" }, req.filters] }
        return this.partnersProvider.get(req);
    }

    @Get('partners/:id')
    getPartner(@Req() req: ExtRequest) {
        return this.partnersProvider.getById(req);
    }

    @Post('partners')
    @UseInterceptors(AnyFilesInterceptor())
    PostPartners(@Req() req: ExtRequest, @UploadedFiles() files) {
        let dir = path.resolve(__dirname, '../../', 'uploads');
        if (fs.existsSync(dir) === false) {
            fs.mkdirSync(dir);
        }

        for (let file of (files || [])) {
            const filename = newGuid() + '.' + file.originalname.split('.').pop();
            const filePath = path.resolve(dir, filename);
            try {
                fs.writeFileSync(filePath, file.buffer);
                if (file.fieldname == "cover") {
                    req.body.cover = Global.ENDPOINT + "/projects/image?image=" + filename;
                }
            } catch (err) {
            }
        }

        req.body.id = newGuid();
        return this.partnersProvider.add(req.body);
    }

    // @Post('stakeholders')
    // PostStakeholders(@Req() req: ExtRequest) {
    //     return this.partnersProvider.add(req.body);
    // }

    @Put('partners')
    @UseInterceptors(AnyFilesInterceptor())
    PutPartners(@Req() req: ExtRequest, @UploadedFiles() files) {
        let dir = path.resolve(__dirname, '../../', 'uploads');
        if (fs.existsSync(dir) === false) {
            fs.mkdirSync(dir);
        }

        for (let file of (files || [])) {
            const filename = newGuid() + '.' + file.originalname.split('.').pop();
            const filePath = path.resolve(dir, filename);
            try {
                fs.writeFileSync(filePath, file.buffer);
                if (file.fieldname == "cover") {
                    req.body.cover = Global.ENDPOINT + "/projects/image?image=" + filename;
                }
            } catch (err) {
            }
        }
        return this.partnersProvider.update(req.body, req.body.guid);
    }

    // @Put('stakeholders')
    // PutStakeholders(@Req() req: ExtRequest) {
    //     return this.partnersProvider.update(req.body, req.body.guid);        
    // }

    @Delete('partners/:guid')
    DeletePartners(@Req() req: ExtRequest) {
        return this.partnersProvider.delete(req.params.guid);
    }

    // @Delete('stakeholders/:guid')
    // DeleteStakeholders(@Req() req: ExtRequest) {
    //     return this.partnersProvider.delete(req.params.guid);
    // }
}
