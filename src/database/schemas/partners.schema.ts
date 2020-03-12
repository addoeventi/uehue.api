import { Schema, model, Model, Document } from 'mongoose';
import { DBCollections } from '../../environment/db';

export const PartnerSchema = new Schema({
    guid: { type: String, required: 'GUID_REQUIRED' },
    name: String,
    surname: String,
    description: String,
    type: { type: String, enum: ["partner", "stakeholder"] },
    enabled: { type: Boolean }
});

export const UserModel: Model<Document, {}> = model(DBCollections.PARTNER, PartnerSchema);
