import * as mongoose from 'mongoose';
import { Module } from '@nestjs/common';
import {UserSchema} from './schemas/users.schema';
import {ProjectSchema} from './schemas/projects.schema';
import {DBCollections, DBModel} from '../environment/db';
import { RoleSchema } from './schemas/roles.schema';
import { PartnerSchema } from './schemas/partners.schema';

export const databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect('mongodb://localhost/uehue'),
    },
    {
        provide: DBModel.PARTNER_MODEL,
        useFactory: () => mongoose.connection.model(DBCollections.PARTNER, PartnerSchema),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: DBModel.USER_MODEL,
        useFactory: () => mongoose.connection.model(DBCollections.USER, UserSchema),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: DBModel.PROJECT_MODEL,
        useFactory: () => mongoose.connection.model(DBCollections.PROJECT, ProjectSchema),
        inject: ['DATABASE_CONNECTION'],
    },
    {
        provide: DBModel.ROLE_MODEL,
        useFactory: () => mongoose.connection.model(DBCollections.ROLE, RoleSchema),
        inject: ['DATABASE_CONNECTION'],
    }
];

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}
