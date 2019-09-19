import { Controller, Get, Req } from '@nestjs/common';
import { RolesProvider } from 'src/providers/roles.provider';
import { ExtRequest } from 'extended/types.extended';

@Controller('roles')
export class RolesController {
    constructor(private roleProvider: RolesProvider) {

    }

    @Get()
    get(@Req() req: ExtRequest) {
        return this.roleProvider.get();
    }
}
