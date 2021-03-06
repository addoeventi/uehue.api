import {Schema, model, Model, Document} from 'mongoose';
import {RoleSchema} from './roles.schema';
import {ProjectSchema} from './projects.schema';
import {Role} from '../../../../uehue.models';
import {DBCollections} from '../../environment/db';

export const UserSchema = new Schema({
    guid: {
        type: String,
        required: 'GUID_REQUIRED',
    },
    email: {
        type: String,
        required: 'EMAIL_REQUIRED',
    },
    password: {
        type: String,
        required: 'PASSWORD_REQUIRED',
        select: false,
    },
    name: String,
    surname: String,
    roles: [{ type: RoleSchema, default : [ Role.defaultRole() ]}],
    projects: [{ type: ProjectSchema, default : []}],
    enabled: { type: Boolean}
});

export const UserModel: Model<Document, {}> =  model(DBCollections.USER, UserSchema);
