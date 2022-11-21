import mongoose from 'mongoose';
import INote from './note.interface';

const NoteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: 'Subject not entered',
        },
        subtitle: {
            type: String,
            required: true,
            default: 'General',
        },
        hidden: {
            type: Boolean,
            required: true,
        },
        description: {
            type: String,
            required: true,
            default: 'Text not entered',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

const NoteModel = mongoose.model<INote & mongoose.Document>('Note', NoteSchema);
export default NoteModel;
