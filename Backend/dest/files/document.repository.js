"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const document_model_1 = __importDefault(require("./document.model"));
const utils_1 = require("../utils/utils");
class DocumentRepository {
    static getDocumentById(documentId) {
        const foundDocument = document_model_1.default.findById(documentId).exec();
        return foundDocument;
    }
    static getAllDocumentsByUserId(userId) {
        const userDoucments = document_model_1.default.find({ userId }).exec();
        return userDoucments;
    }
    static async getAllUserDocsBySub(userId, subject, connectedUserId) {
        console.log('not my self page', userId, connectedUserId);
        const groupManagers = await (0, utils_1.filterRelevantUsers)(userId, connectedUserId);
        console.log('2222222222222222222222', groupManagers);
        const notPublicUserDoucments = await document_model_1.default.find({
            userId,
            subject,
            hidden: true,
            createdBy: { $in: groupManagers },
        })
            .populate([
            {
                path: 'createdBy',
                model: 'User',
            },
        ])
            .exec();
        const publicUserDoucments = await document_model_1.default.find({
            userId,
            subject,
            hidden: false,
        })
            .populate([
            {
                path: 'createdBy',
                model: 'User',
            },
        ])
            .exec();
        // TODO: pull too the public docs
        if (!publicUserDoucments || !notPublicUserDoucments)
            return null;
        return notPublicUserDoucments.concat(publicUserDoucments);
    }
    static getAllSelfDocsBySub(userId, subject) {
        console.log(' my self page');
        const userDoucments = document_model_1.default.find({
            userId,
            subject,
            hidden: false,
        })
            .populate([
            {
                path: 'createdBy',
                model: 'User',
            },
        ])
            .exec();
        return userDoucments;
    }
    static createDocument(newDocument) {
        const addedDocument = document_model_1.default.create(newDocument);
        return addedDocument;
    }
    static updateDocumentById(documentId, documentData) {
        const updatedDocument = document_model_1.default.findByIdAndUpdate(documentId, documentData, {
            new: true,
        })
            .populate([
            {
                path: 'createdBy',
                model: 'User',
            },
        ])
            .exec();
        return updatedDocument;
    }
    static deletedDocumentById(documentId) {
        const deletedDocument = document_model_1.default.findByIdAndDelete(documentId).exec();
        return deletedDocument;
    }
}
exports.default = DocumentRepository;
