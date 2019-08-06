import { Module } from '@nestjs/common';
import { ProjectsController } from './projects/projects.controller';
import {DatabaseModule} from '../database/db.provider';
import {ProjectsProvider} from '../providers/projects.provider';

@Module({
  controllers: [ProjectsController],
  imports: [DatabaseModule],
  providers: [ProjectsProvider]
})
export class ProjectsModule {}
