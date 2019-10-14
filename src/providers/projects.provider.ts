import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { DocumentProject } from '../database/models';
import { newGuid } from 'ts-guid';
import { ExtRequest } from '../../extended/types.extended';
import { DBModel } from '../environment/db';
import { AuthProvider } from './auth.providers';
import { IProject } from '../../../uehue.models';
const fs = require('fs');
const path = require('path');

@Injectable()
export class ProjectsProvider {

    constructor(@Inject(DBModel.PROJECT_MODEL) private project: Model<DocumentProject>, private auth: AuthProvider) {

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

    async getReview(req: ExtRequest) {
        const me = await this.auth.me(req.identity);

        let aggregate: any[] = [

        ];

        aggregate = req.create(req, aggregate);

        const isAdmin = me.user.roles.find(f => f.name === 'ADMIN') != null;
        const isProf = me.user.roles.find(f => f.name === 'PROFESSIONIST') != null;
        const $match = aggregate.find(f => Object.keys(f)[0] === '$match').$match;
        if ($match && !isAdmin) {
            if (!(isProf && $match.status === 'DECLINED')) {
                $match['admin.guid'] = me.user.guid;
            }
        }

        aggregate.push({
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
            {
                $unwind: {
                    path: '$professionstReview',
                    includeArrayIndex: "arrIndex",
                    preserveNullAndEmptyArrays: true
                }
            },
            { $match: { 'professionstReview.user.guid': me.user.guid } }
        );

        req.fields = req.fields || {
            'admin.projects': 0,
        };

        req.fields['admin.projects'] = 0;

        return this.project.aggregate(aggregate);
    }

    async get(req: ExtRequest, filters?: any[]) {

        let aggregate: any[] = [

        ];

        aggregate = req.create(req, aggregate);

        if (req.identity != null) {
            const me = await this.auth.me(req.identity);

            const isAdmin = me.user.roles.find(f => f.name === 'ADMIN') != null;
            const isProf = me.user.roles.find(f => f.name === 'PROFESSIONIST') != null;
            let $match = aggregate.find(f => Object.keys(f)[0] === '$match').$match;
            if ($match && !isAdmin) {
                if (!(isProf && $match.status === 'DECLINED')) {
                    $match['admin.guid'] = me.user.guid;
                }
            }
        }
        else {
            req.fields = {
                guid: 1,
                name: 1,
                short_description: 1,
                budget: 1,
                categories: 1,
                cover: 1,
                status: 1
            }
        }

        aggregate.push({
            $lookup: {
                from: 'users',
                localField: 'admin.guid',
                foreignField: 'guid',
                as: 'admin',
            },
        },
            {
                $unwind: '$admin',
            }
        );

        if (filters) {
            aggregate.push(...filters)
        }

        req.fields = req.fields || {
            'admin.projects': 0,
        };

        req.fields['admin.projects'] = 0;

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
                fs.writeFileSync(filePath, file.buffer);
                body.files.push({
                    path: filePath,
                    name: file.originalname,
                } as any);
            } catch (err) {
                errors.push({ err, file: file.originalname });
            }
        });
        body.team.forEach(member => {
            if (member.cv && member.cv.data) {
                const filePath = path.resolve(__dirname, 'uploads', newGuid() + '.' + member.cv.name.split('.').pop());
                const buffer = Buffer.from(member.cv.data, 'base64');

                member.cv.data = null;
                member.cv.path = filePath;

                fs.writeFileSync(filePath, buffer);
            }
        });
        return errors;
    }

    post(files, body, identity) {
        return new Promise((resolve, reject) => {
            try {
                body.admin = identity;
                body.files = body.files || [];

                body.guid = body.guid || newGuid();

                const errors = this.saveFiles(files, body);


                this.project.create(body).then(item => {
                    resolve({ item, errors });
                }).catch(err => {
                    reject(err);
                });

            } catch (er) {
                reject(er)
            }
        });
    }

    review(projectId, review, body) {

        if (review) {
            return this.project.findOneAndUpdate({
                "guid": projectId,
                "professionstReview.guid": review
            }, {
                    $set: {
                        "professionstReview.$.guid": body.guid,
                        "professionstReview.$.analisys": body.analisys,
                        "professionstReview.$.budget": body.budget,
                        "professionstReview.$.effort": body.effort,
                        "professionstReview.$.note": body.note
                    }
                })
        }
        else {
            body.guid = newGuid();
            return this.project.findOneAndUpdate({
                "guid": projectId
            }, {
                    $push: {
                        professionstReview: body
                    }
                })
        }


    }

    setStatus(guid, status) {
        //
        return this.project.findOneAndUpdate({ guid }, { $set: { status } });
    }

    update(files, body, identity) {
        return new Promise((resolve, reject) => {
            try {
                body.admin = identity;
                body.files = body.files || [];

                body.guid = body.guid || newGuid();

                const oldFiles = body.oldFiles || '[]';

                body.files = JSON.parse(oldFiles);

                const errors = this.saveFiles(files, body);

                this.project.findOne({ guid: body.guid }).then(project => {
                    const ob: DocumentProject = project;

                    for (const key in body) {
                        ob[key] = body[key];
                    }

                    ob.save().then(res => {
                        resolve(errors);
                    }).catch(err => {
                        reject(err);
                    });
                });
            }
            catch (er) {
                reject(er);
            }

        });

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
