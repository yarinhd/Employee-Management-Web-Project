"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const GroupSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        // unique: true,
        // index: true,
    },
    usersId: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: 'User',
        required: true,
        default: [],
    },
    parentName: {
        type: String,
        default: null,
    },
    manager: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        default: null,
    },
}, {
    timestamps: true,
});
const GroupModel = mongoose_1.default.model('Group', GroupSchema);
exports.default = GroupModel;
