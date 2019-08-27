import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DocumentProject } from '../database/models';
import { newGuid } from 'ts-guid';
import { ExtRequest } from '../../extended/types.extended';
import { DBModel } from '../environment/db';
const fs = require('fs');
const path = require('path');

@Injectable()
export class ProjectsProvider {

    constructor(@Inject(DBModel.PROJECT_MODEL) private project: Model<DocumentProject>) {

    }

    getById(guid, req: ExtRequest) {

        let aggregate: any[] = [

            {
                $lookup: {
                    from: 'users',
                    localField: 'admin.guid',
                    foreignField: 'guid',
                    as: 'admin',
                },
            },
            {
                $unwind: '$admin',
            },
            { $match: { guid } },
        ];

        aggregate = req.create(req, aggregate);

        return new Promise((resolve, reject) => {
            this.project.aggregate(aggregate).then(results => resolve(results[0])).catch(err => reject(err));
        });
    }

    get(req: ExtRequest) {

        let aggregate: any[] = [
            {
                $lookup: {
                    from: 'users',
                    localField: 'admin.guid',
                    foreignField: 'guid',
                    as: 'admin',
                },
            },
            {
                $unwind: '$admin',
            },
        ];

        req.fields = req.fields || {
            'admin.projects': 0,
        };

        req.fields['admin.projects'] = 0;

        aggregate = req.create(req, aggregate);

        return this.project.aggregate(aggregate);
    }

    saveFiles(files, body) {
        const fs = require('fs');
        const path = require('path');

        if (fs.existsSync(path.resolve(__dirname, 'uploads')) === false) {
            fs.mkdirSync(path.resolve(__dirname, 'uploads'));
        }

        const errors = [];

        files.forEach((file) => {
            const filePath = path.resolve(__dirname, 'uploads', newGuid() + '.' + file.originalname.split('.').pop());

            try {
                fs.writeFileSync(filePath, file);
                body.files.push({
                    path: filePath,
                    name: file.originalname,
                } as any);
            } catch (err) {
                errors.push({ err, file: file.originalname });
            }
        });
        return errors;
    }

    post(files, body, identity) {

        body.admin = identity;
        body.files = body.files || [];

        body.guid = body.guid || newGuid();

        const errors = this.saveFiles(files, body);

        return new Promise((resolve, reject) => {
            this.project.create(body).then(item => {
                resolve({ item, errors });
            }).catch(err => {
                reject(err);
            });
        });
    }

    update(files, body, identity) {
        return new Promise((resolve, reject) => {
            body.admin = identity;
            body.files = body.files || [];

            body.guid = body.guid || newGuid();

            const oldFiles = body.oldFiles || '[]';

            body.files = JSON.parse(oldFiles);

            const errors = this.saveFiles(files, body);

            this.project.findOne({ guid: body.guid }).then(project => {
                const ob: DocumentProject = project;

                ob.name = body.name;
                ob.description = body.description;
                ob.status = body.status;
                ob.files = body.files;

                ob.save().then(res => {
                    resolve(errors);
                }).catch(err => {
                    reject(err)
                });
            })
        })




    }

    delete(guid, req: ExtRequest) {
        return this.project.findOneAndUpdate({ guid }, {
            $set: {
                deletedBy: req.identity,
                deletedDate: new Date(),
                status: 'DELETED',
            },
        });
    }

    sendFile(filePath) {
        return path.resolve(__dirname, 'uploads', filePath);
    }

}
