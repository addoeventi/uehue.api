import {Controller, Get, Req, SetMetadata, Put, Res, UseGuards} from '@nestjs/common';
import {UsersProvider} from '../../providers/users.provider';
import {ExtRequest} from '../../../extended/types.extended';
import { Response } from 'express';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class UsersController {

    constructor(private userProvider: UsersProvider) {

    }


    @SetMetadata('roles',['ADMIN'])
    @Get('users')
    get(@Req() req: ExtRequest) {
        return this.userProvider.get(req);
    }

    @SetMetadata('roles',['ADMIN'])
    @Put('users/:guid')
    public update(@Req() req: ExtRequest, @Res() res: Response){
        this.userProvider.update(req.body, req.params.guid).then(result => {
            res.status(200).send(result);
        }).catch( err => {
            res.status(400).send(err);
        });
    }

}
