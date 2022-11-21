import mongoose from 'mongoose';
import { IPeopleUser } from './people_user.interface';

const PeopleUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    fullName: {
        type: String,
    },
    rank: {
        type: String,
    },
    job: {
        type: String,
    },
    birthday: {
        type: String,
    },
    releaseDate: {
        type: String,
    },
    gender: {
        type: String,
    },
    serviceEndDate: {
        type: String,
    },
    team: {
        type: String,
    },
    teamManager: {
        type: String,
    },
    managerName: {
        type: String,
    },
    mador: {
        type: String,
    },
    madorManager: {
        type: String,
    },
    branch: {
        type: String,
    },
    branchManager: {
        type: String,
    },
});

const PeopleUserModel = mongoose.model<IPeopleUser & mongoose.Document>('PeopleUser', PeopleUserSchema);
export default PeopleUserModel;
