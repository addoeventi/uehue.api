import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.use(bodyParser.json({limit: '500mb', }));
  app.use(bodyParser.urlencoded({limit: '500mb', parameterLimit: 1000000000, extended: true}));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
