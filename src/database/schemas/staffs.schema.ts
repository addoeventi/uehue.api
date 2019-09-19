import { Schema, model, Model, Document } from 'mongoose';
import { DBCollections } from 'src/environment/db';

export const StaffSchema = new Schema({
    guid: String,
    images: [{ type: Array, default: [] }],
    name: String,
    subTitle: String,
    description: String,
});

export const UserModel: Model<Document, {}> = model(DBCollections.STAFF, StaffSchema);
