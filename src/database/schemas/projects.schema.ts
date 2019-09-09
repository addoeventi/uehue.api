import * as mongoose from 'mongoose';

import {Document, model, Model} from 'mongoose';
import {DBCollections} from '../../environment/db';

export const ProjectSchema = new mongoose.Schema({
    guid: { type: String, required: true},
    name: { type: String, required: true},
    short_description: { type: String },
    budget_usage_description:  { type: String },
    team_description: { type: String },
    budget:  { type: Number, required: true },
    interesting_point: { type: String },
    date: { type: Date, required: true, default: new Date()},
    categories: [{ type: String, default: []}],
    cover: { type: String },
    admin: {},
    restrictedRole: {},
    description: { type: String, required: true },
    status: { type: String, required: true },
    main_person: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    website: { type: String,  },
    files: [{type: Object, default: []}],
    steps: [{ type: Object, default: []}],
    deletedDate: { type: Date },
    deletedBy: {},
});

export const ProjectModel: Model<Document, {}> =  model(DBCollections.PROJECT, ProjectSchema);
