import { Schema, Model, model, Document} from 'mongoose';
import * as mongoose from 'mongoose';

import { DBCollections } from 'src/environment/db';
import { IRole, Role } from '../../../../uehue.models';

export const RoleSchema = new Schema({
    description: String,
    name: String,
    privileges: [],
});

export const RoleModel: Model<Document, {}> =  model(DBCollections.ROLE, RoleSchema);

const basic: IRole = Role.defaultRole();
const admin: IRole = new Role();
admin.name = 'ADMIN';
admin.description = 'Full user';
admin.privileges = ['READ' , 'CREATE' , 'DELETE' , 'UPDATE'];

const startupper: IRole = new Role();
startupper.name = 'STARTUPPER';
startupper.description = 'Startupper user';
startupper.privileges = [{READ : 'OWN'} , 'CREATE', {DELETE: 'own'}, {UPDATE: 'own'}];

const stakeholder: IRole = new Role();
stakeholder.name = 'STACKEHOLDER';
stakeholder.description = 'STACKEHOLDER user';
stakeholder.privileges = ['READ' , 'CREATE', {DELETE: 'own'}, {UPDATE: 'own'}];

const professionist: IRole = new Role();
professionist.name = 'PROFESSIONIST';
professionist.description = 'PROFESSIONIST user';
professionist.privileges = [{READ: 'DECLINED'} , 'CREATE', {DELETE: 'own'}, {UPDATE: 'own'}];

const insertIfNotExists = (role: IRole) => {
    const MODEL = mongoose.connection.model(DBCollections.ROLE, RoleSchema);
    MODEL
        .findOne({name: role.name})
        .then(result => {
            if (!result) {
             MODEL.insertMany([role]).then((ROLE) => {
                 console.log(ROLE);
             });
            }
        });
};
// insertIfNotExists(basic);
// insertIfNotExists(admin);
// insertIfNotExists(startupper);
// insertIfNotExists(stakeholder);
// insertIfNotExists(professionist);
