import { Injectable, Inject } from '@nestjs/common';
import { DBModel } from '../environment/db';
import { Model } from 'mongoose';
import { DocumentRole } from '../database/models';
import { IRole } from '../../../uehue.models';

@Injectable()
export class RolesProvider {

    constructor(@Inject(DBModel.ROLE_MODEL) private role: Model<DocumentRole>) {

    }

    get(): Promise<DocumentRole[]> {
        return new Promise((resolve, reject) => {
            this.role.find().then( result => {
                resolve(result);
            }).catch(er => {
                reject(er);
            });
        });
    }
}
