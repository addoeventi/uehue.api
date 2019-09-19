import * as mongoose from 'mongoose';

import {Document, model, Model} from 'mongoose';
import {DBCollections} from '../../environment/db';

export const ProjectSchema = new mongoose.Schema({
    guid: { type: String, required: true},
    name: { type: String, required: true},
    date: { type: Date, required: true, default: new Date()},
    categories: [{type: String}],
    admin: {},
    restrictedRole: {},
    description: String,
    status: String,
    files: [{type: Object, default: []}],
    steps: [{ type: Object, default: []}],
    deletedDate: Date,
    deletedBy: {},
    professionstReview: { type: Array, default: []}
});

export const ProjectModel: Model<Document, {}> =  model(DBCollections.PROJECT, ProjectSchema);
