import { Controller, Post, Put, Query, Body, Param, Req, Inject, Get, SetMetadata, UseGuards, Res } from '@nestjs/common';
import { AuthProvider } from '../../providers/auth.providers';
import { DocumentUser } from '../../database/models';
import { ExtRequest } from '../../../extended/types.extended';
import { AuthGuard } from '../../guards/auth.guard';
import { Response } from 'express';
import { IUser } from '../../../../uehue.models';

@Controller('auth')
export class AuthController {

    constructor(private authProvider: AuthProvider) { }

    @Post('signin')
    signin(@Body() user: DocumentUser, @Res() response: Response) {
        this.authProvider.signin(user).subscribe(result => {
            response.status(200).send(result);
        }, error => {
            response.status(400).send(error);
        });
    }

    @Post('login')
    login(@Body('email') email, @Body('password') password, @Res() response) {
        this.authProvider.login(email, password).then(result => {
            response.status(200).send(result);
        }).catch(err => {
            response.status(400).send(err);
        });
    }

    @Get('me')
    @UseGuards(AuthGuard)
    me(@Req() req: ExtRequest) {
        return this.authProvider.me(req.identity);
    }

    @Put('recovery/:email')
    recovery(@Param('email') email, @Res() response: Response) {
        this.authProvider.recovery(email)
        .then(f => {
            response.status(200).send(f);
        }).catch(err => {
            response.status(400).send(err)
        })

    }

    @Put('edit/:guid')
    edit(@Param('guid') guid, @Body() user: IUser, @Res() response) {
        this.authProvider.update(guid, user).then(result => {
            response.status(200).send(result);
        }).catch(err => {
            response.status(400).send(err);
        });
    }
}
