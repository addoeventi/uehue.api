import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import {DatabaseModule} from './database/db.provider';
import { ProjectsModule } from './projects/projects.module';
import {RequestMiddleware} from './middleware/request.middleware';
import {APP_GUARD} from '@nestjs/core';
import {AuthGuard} from './guards/auth.guard';
import {UnauthenticatedMiddleware} from './middleware/unauthenticated.middleware';
import {AuthController} from './user/auth/auth.controller';
import {ProjectsController} from './projects/projects/projects.controller';
import { RolesController } from './controllers/roles/roles.controller';
import { RolesProvider } from './providers/roles.provider';
import { StaffsController } from './controllers/staffs/staffs.controller';

@Module({
  imports: [UserModule, DatabaseModule, ProjectsModule],
  controllers: [AppController, RolesController, StaffsController],
  providers: [
      AppService,
      RolesProvider,
      /*{
            provide: APP_GUARD,
            useClass: AuthGuard,
      },*/
    ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(RequestMiddleware)
          .forRoutes('*');
      consumer
          .apply(UnauthenticatedMiddleware)
          .exclude(
              {
                  path: 'projects/file',
                  method: RequestMethod.ALL,
              })
          .forRoutes(ProjectsController);

      consumer
        .apply(UnauthenticatedMiddleware)
        .exclude(
            {
              path: 'auth/login',
              method: RequestMethod.ALL,
            },
            {
              path: 'auth/signin',
              method: RequestMethod.ALL,
            },
        ).forRoutes(AuthController);
  }
}
