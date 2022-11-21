import mongoose from 'mongoose';
import { IGroup } from './group.interface';

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            // unique: true,
            // index: true,
        },
        usersId: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            required: true,
            default: [],
        },
        parentName: {
            type: String,
            default: null,
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const GroupModel = mongoose.model<IGroup & mongoose.Document>('Group', GroupSchema);
export default GroupModel;
