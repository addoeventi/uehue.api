import {Inject, Injectable} from '@nestjs/common';
import {DBModel} from '../environment/db';
import {Model} from 'mongoose';
import {DocumentUser} from '../database/models';
import {ExtRequest} from '../../extended/types.extended';

@Injectable()
export class PartnerProvider {

    constructor(@Inject(DBModel.PARTNER_MODEL) private partnerModel: Model<any>) {
    }

    get(req: ExtRequest) {
        return this.partnerModel.find(req.filters, req.fields).skip(req.skip).limit(req.limit);
    }

    getById(req: ExtRequest) {
        return  new Promise((resolve, reject) => {
            this.partnerModel.find({guid: req.params.id}, req.fields)
            .then(res => {
                resolve(res[0])
            }).catch(err => {
                reject(err)
            })
        })
        
    }

    add(partner: any) {
        return this.partnerModel.create(partner);
    }

    update(fields, guid){
        return this.partnerModel.findOneAndUpdate({guid}, { $set: fields}, {new: true});
    }

    delete(guid){
        return this.partnerModel.findOneAndRemove({guid});
    }
}
