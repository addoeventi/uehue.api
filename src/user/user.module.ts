import { Module, HttpModule } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import {DatabaseModule} from '../database/db.provider';
import {AuthProvider} from '../providers/auth.providers';
import {UsersProvider} from '../providers/users.provider';
import {UsersController} from './users/users.controller';

@Module({
  controllers: [AuthController, UsersController],
  imports: [ DatabaseModule, HttpModule ],
  providers: [ AuthProvider, UsersProvider ],
})
export class UserModule {}
