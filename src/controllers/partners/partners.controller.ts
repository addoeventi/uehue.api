import { Controller, Get, Req, Post, Put, Delete } from '@nestjs/common';
import { ExtRequest } from 'extended/types.extended';
import { PartnerProvider } from '../../providers/partners.provider';

@Controller()
export class PartnersController {
    constructor(private partnersProvider: PartnerProvider) {

    }

    @Get('partners')
    getPartners(@Req() req: ExtRequest) {
        req.filters = {$and: [{type: "partner"}, req.filters]}
        return this.partnersProvider.get(req);
    }

    @Get('stakeholders')
    getStakeholders(@Req() req: ExtRequest) {
        req.filters = {$and: [{type: "stakeholder"}, req.filters]}
        return this.partnersProvider.get(req);
    }
    
    @Post('partners')
    PostPartners(@Req() req: ExtRequest) {
        return this.partnersProvider.add(req.body);
    }

    @Post('stakeholders')
    PostStakeholders(@Req() req: ExtRequest) {
        return this.partnersProvider.add(req.body);
    }

    @Put('partners')
    PutPartners(@Req() req: ExtRequest) {
        return this.partnersProvider.update(req.body, req.body.guid);
    }

    @Put('stakeholders')
    PutStakeholders(@Req() req: ExtRequest) {
        return this.partnersProvider.update(req.body, req.body.guid);        
    }
    
    @Delete('partners/:guid')
    DeletePartners(@Req() req: ExtRequest) {
        return this.partnersProvider.delete(req.params.guid);
    }

    @Delete('stakeholders/:guid')
    DeleteStakeholders(@Req() req: ExtRequest) {
        return this.partnersProvider.delete(req.params.guid);
    }
}
