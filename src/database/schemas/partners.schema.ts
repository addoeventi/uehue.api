import { Schema, model, Model, Document } from 'mongoose';
import { DBCollections } from '../../environment/db';

export const PartnerSchema = new Schema({
    guid: { type: String, required: 'GUID_REQUIRED' },
    name: String,
    surname: String,
    description: String,
    cover: String,
    type: { type: String, enum: ["partner", "stakeholder"] },
    enabled: { type: Boolean, default: true }
});

export const PartnerModel: Model<Document, {}> = model(DBCollections.PARTNER, PartnerSchema);
