import { Controller, Post, Put,  Query, Body } from '@nestjs/common';
import { User } from 'uehue.models';

@Controller('auth')
export class AuthController {

    @Post('signin')
    signin(@Body('user') user: User) {
        return user;
    }

    @Post('login')
    login(@Query('username') username,@Query('password') password){
        return username + password;
    } 

    @Put('recovery')
    recovery(){

    }
}
