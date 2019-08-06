import {Inject, Injectable} from '@nestjs/common';
import {DBModel} from '../environment/db';
import {Model} from 'mongoose';
import {DocumentUser} from '../database/models';
import {ExtRequest} from '../../extended/types.extended';

@Injectable()
export class UsersProvider {

    constructor(@Inject(DBModel.USER_MODEL) private userModel: Model<DocumentUser>) {
    }

    get(req: ExtRequest) {
        return this.userModel.find(req.filters, req.fields).skip(req.skip).limit(req.limit);
    }
}
