import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/db.provider';
import { ProjectsModule } from './projects/projects.module';
import { RequestMiddleware } from './middleware/request.middleware';
import { APP_GUARD } from '@nestjs/core';
import { UnauthenticatedMiddleware } from './middleware/unauthenticated.middleware';
import { AuthController } from './user/auth/auth.controller';
import { ProjectsController } from './projects/projects/projects.controller';
import { RolesController } from './controllers/roles/roles.controller';
import { RolesProvider } from './providers/roles.provider';
import { MailerModule } from '@nest-modules/mailer';
import { MAILCONFIG } from './variables';
import { PartnersController } from './controllers/partners/partners.controller';
import { PartnerProvider } from './providers/partners.provider';

@Module({
  imports: [
    MailerModule.forRoot(MAILCONFIG),
    UserModule, DatabaseModule, ProjectsModule],
  controllers: [AppController, RolesController, PartnersController],
  providers: [
    AppService,
    RolesProvider,
    PartnerProvider
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
          path: 'projects/file/download',
          method: RequestMethod.ALL,
        },
        {
          path: 'projects',
          method: RequestMethod.GET
        },
        {
          path: 'projects/:guid',
          method: RequestMethod.GET
        },
        {
          path: 'auth/login',
          method: RequestMethod.ALL,
        },
        {
          path: 'auth/signin',
          method: RequestMethod.ALL,
        },
        {
          path: 'auth/recovery/:email',
          method: RequestMethod.ALL,
        })
      .forRoutes(ProjectsController, AuthController);

  }
}
