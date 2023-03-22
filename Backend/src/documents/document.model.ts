import mongoose from 'mongoose';
import { IDocument } from './document.interface';

const DocumentSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
        },
        hidden: {
            type: Boolean,
            required: true,
        },
        fileName: {
            type: String,
            default: null,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const DocumentModel = mongoose.model<IDocument & mongoose.Document>('Document', DocumentSchema);
export default DocumentModel;
