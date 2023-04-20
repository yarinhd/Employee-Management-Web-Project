"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PeopleUserSchema = new mongoose_1.default.Schema({
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
const PeopleUserModel = mongoose_1.default.model('PeopleUser', PeopleUserSchema);
exports.default = PeopleUserModel;
