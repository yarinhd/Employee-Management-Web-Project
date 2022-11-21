"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
UserSchema.virtual('avatar').get(function () {
    return `https://people/api/v1/user/image/${this.username}?defaultImage=false`;
});
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.default = UserModel;
