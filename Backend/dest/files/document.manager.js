"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const minio_repository_1 = require("./minio/minio.repository");
const userError_1 = require("../utils/errors/userError");
const document_repository_1 = __importDefault(require("./document.repository"));
const user_manager_1 = __importDefault(require("../users/user.manager"));
const document_enum_1 = require("./document.enum");
class DocumentManager {
    /**
     * @param {string} documentId document Id as PK
     * @return {IDocument} found document json
     */
    static async getDocumentById(documentId) {
        const foundDocument = await document_repository_1.default.getDocumentById(documentId);
        if (!foundDocument) {
            throw new userError_1.DocumentNotFoundError('Document not found - failed while searching document');
        }
        return foundDocument;
    }
    /**
     * @param {string} documentId document Id as PK
     * @param {Response} res response for the request
     * @return {IDocument} found document file download (using minio - S3)
     */
    static async downloadDocumentById(documentId, res) {
        console.log('hohohohoohoho');
        const foundDocument = await document_repository_1.default.getDocumentById(documentId);
        if (!foundDocument) {
            throw new userError_1.DocumentNotFoundError('Document not found - failed while searching document');
        }
        await minio_repository_1.MinioRepository.getFileStreamByDocName(String(documentId), foundDocument.fileName, res);
        // return foundDocument;
    }
    /**
     * @param {string} userId user Id as PK
     * @return {IDocument[]} all document related to userId
     */
    static async getAllDocumentsByUserId(userId) {
        await user_manager_1.default.getUserByUserId(userId);
        const userDocuments = await document_repository_1.default.getAllDocumentsByUserId(userId);
        if (!userDocuments) {
            throw new userError_1.DocumentNotFoundError('Document not found - failed while searching document');
        }
        return userDocuments;
    }
    /**
     * @param {string} userId user Id as PK
     * @param {DocumentSubject} subject enum subject of the document
     * @return {IDocument[]} all document related to userId and subject
     */
    static async getAllUserDocsBySub(userId, subject, connectedUserId) {
        console.log(`userId: ${userId}, subject:${subject}`);
        await user_manager_1.default.getUserByUserId(userId);
        if (!Object.values(document_enum_1.DocumentSubject).includes(subject)) {
            throw new userError_1.WrongInputSubjectError('Subject is not exist - choose option from the box');
        }
        const userDocuments = await document_repository_1.default.getAllUserDocsBySub(userId, subject, connectedUserId);
        if (!userDocuments) {
            throw new userError_1.DocumentNotFoundError('Document not found - failed while searching document');
        }
        return userDocuments;
    }
    /**
     * @param {string} userId user Id as PK
     * @param {DocumentSubject} subject enum subject of the document
     * @return {IDocument[]} all document related to userId and subject
     */
    static async getAllSelfDocsBySub(userId, subject) {
        console.log(`userId: ${userId}, subject:${subject}`);
        await user_manager_1.default.getUserByUserId(userId);
        if (!Object.values(document_enum_1.DocumentSubject).includes(subject)) {
            throw new userError_1.WrongInputSubjectError('Subject is not exist - choose option from the box');
        }
        const userDocuments = await document_repository_1.default.getAllSelfDocsBySub(userId, subject);
        if (!userDocuments) {
            throw new userError_1.DocumentNotFoundError('Document not found - failed while searching document');
        }
        return userDocuments;
    }
    /**
     * @param {string} userId user Id as PK
     * @param {IFormidableObj} formfields parsed request fileds and files
     * @return {IDocument[]} created document after uploading file to minio and doc creation
     */
    static async createDocument(formfields, userId, createdBy) {
        var _a;
        if (!formfields.files.upload) {
            throw new userError_1.FileNotUploadedError('File not uploaded');
        }
        if (!Object.values(document_enum_1.DocumentSubject).includes(formfields.fields.subject)) {
            throw new userError_1.WrongInputSubjectError('Subject is not exist - choose option from the box');
        }
        await user_manager_1.default.getUserByUserId(userId);
        console.log(`formfields: ${JSON.stringify(formfields.fields)}`);
        const DocumentData = {
            userId,
            subject: formfields.fields.subject,
            hidden: formfields.fields.hidden === 'true',
            createdBy,
            fileName: formfields.files.upload.originalFilename,
        };
        const filePath = formfields.files.upload.filepath;
        const addedDocument = await document_repository_1.default.createDocument(DocumentData);
        if (!addedDocument) {
            throw new userError_1.DocumentNotFoundError('Couldnt create Document - failed to create document');
        }
        await minio_repository_1.MinioRepository.uploadFileByDocId(addedDocument._id, (_a = addedDocument.fileName) === null || _a === void 0 ? void 0 : _a.split('.').pop(), filePath);
        return addedDocument;
    }
    /**
     * @param {string} documentId docuument Id as PK
     * @param {Partial<IDocument>} documentData document data for update
     * @return {IDocument} updated document based on document data
     */
    static async updateDocumentById(documentId, documentData) {
        const updatedDocument = await document_repository_1.default.updateDocumentById(documentId, documentData);
        if (!updatedDocument) {
            throw new userError_1.DocumentNotFoundError('Document not found - failed to update document');
        }
        return updatedDocument;
    }
    /**
     * @param {string} documentId docuument Id as PK
     * @return {IDocument} deleted document data based on document id + deletion of document file from minio
     */
    static async deletedDocumentById(documentId) {
        const deletedDocument = await document_repository_1.default.deletedDocumentById(documentId);
        if (!deletedDocument) {
            throw new userError_1.DocumentNotFoundError('Document not found - failed to delete document');
        }
        minio_repository_1.MinioRepository.RemoveFileByDocId(deletedDocument);
        return deletedDocument;
    }
}
exports.default = DocumentManager;
