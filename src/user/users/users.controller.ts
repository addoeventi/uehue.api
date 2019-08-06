import {Controller, Get, Req} from '@nestjs/common';
import {UsersProvider} from '../../providers/users.provider';
import {ExtRequest} from '../../../extended/types.extended';

@Controller('users')
export class UsersController {

    constructor(private userProvider: UsersProvider) {

    }

    @Get()
    get(@Req() req: ExtRequest) {
        return this.userProvider.get(req);
    }
}
