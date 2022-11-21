"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const formidable_1 = __importDefault(require("formidable"));
const document_manager_1 = __importDefault(require("./document.manager"));
class DocumentController {
    static async getDocumentById(req, res) {
        const documentId = req.params.documentId;
        const foundDocument = await document_manager_1.default.getDocumentById(documentId);
        res.json(foundDocument);
    }
    static async downloadDocumentById(req, res) {
        const documentId = req.params.documentId;
        await document_manager_1.default.downloadDocumentById(documentId, res);
    }
    static async getAllUserDocsBySub(req, res) {
        console.log(req.query.userId);
        console.log(req.query.subject);
        const loggedUser = String(req.user._id);
        const { userId } = req.query;
        const subject = decodeURI(req.query.subject);
        const userDocuments = await document_manager_1.default.getAllUserDocsBySub(userId, subject, loggedUser);
        console.log(userDocuments);
        res.json(userDocuments);
    }
    static async getAllSelfDocsBySub(req, res) {
        console.log(req.query.userId);
        console.log(req.query.subject);
        const { userId } = req.query;
        const subject = decodeURI(req.query.subject);
        const userDocuments = await document_manager_1.default.getAllSelfDocsBySub(userId, subject);
        console.log(userDocuments);
        res.json(userDocuments);
    }
    static async getAllDocumentsByUserId(req, res) {
        console.log(req.query.userId);
        const { userId } = req.query;
        const userDocuments = await document_manager_1.default.getAllDocumentsByUserId(userId);
        console.log(userDocuments);
        res.json(userDocuments);
    }
    static async createDocument(req, res) {
        const { userId } = req.params;
        const createdBy = req.user;
        const form = (0, formidable_1.default)({ multiples: false });
        // TODO: ask almog how i add catch to the promise!
        const formfields = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }
                // eslint-disable-next-line no-unreachable
                resolve({ fields, files });
            });
        });
        // TODO: ask almog if that is ok
        if (formfields instanceof Error) {
            throw formfields;
        }
        const addedDocument = await document_manager_1.default.createDocument(formfields, userId, createdBy);
        res.json(addedDocument);
    }
    static async updateDocumentById(req, res) {
        const documentId = req.params.documentId;
        const documentData = req.body;
        const updatedDocument = await document_manager_1.default.updateDocumentById(documentId, documentData);
        res.status(200).json(updatedDocument);
    }
    static async deleteDocumentById(req, res) {
        const documentId = req.params.documentId;
        const deletedDocument = await document_manager_1.default.deletedDocumentById(documentId);
        res.status(200).json(deletedDocument);
    }
}
exports.default = DocumentController;
