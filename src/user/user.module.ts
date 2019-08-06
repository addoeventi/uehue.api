import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import {DatabaseModule} from '../database/db.provider';
import {AuthProvider} from '../providers/auth.providers';
import {UsersProvider} from '../providers/users.provider';

@Module({
  controllers: [AuthController],
  imports: [ DatabaseModule ],
  providers: [ AuthProvider, UsersProvider ],
})
export class UserModule {}
