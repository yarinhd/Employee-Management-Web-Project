import mongoose from 'mongoose';
import { IUser } from './user.interface';

const UserSchema = new mongoose.Schema(
    {
        // TODO: Handle duplication of username - build custom error or something like that.
        username: {
            type: String,
            index: true,
            unique: true,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        rank: {
            type: String,
            required: true,
        },
        job: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        dateOfBirth: {
            type: String,
            required: true,
        },
        serviceEndDate: {
            type: String,
            required: true,
        },
        inGroup: {
            type: String,
        },
        madorGroup: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        isBranchManager: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

UserSchema.virtual('avatar').get(function (this: IUser & mongoose.Document) {
    return `https://people/api/v1/user/image/${this.username}?defaultImage=false`;
});

const UserModel = mongoose.model<IUser & mongoose.Document>('User', UserSchema);
export default UserModel;
