import { Module } from '@nestjs/common';
import { ProjectsController } from './projects/projects.controller';
import {DatabaseModule} from '../database/db.provider';
import {ProjectsProvider} from '../providers/projects.provider';
import { AuthProvider } from 'src/providers/auth.providers';

@Module({
  controllers: [ProjectsController],
  imports: [DatabaseModule],
  providers: [ProjectsProvider, AuthProvider]
})
export class ProjectsModule {}
