"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DocumentSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});
const DocumentModel = mongoose_1.default.model('Document', DocumentSchema);
exports.default = DocumentModel;
