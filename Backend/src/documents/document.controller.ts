import { Request, Response } from 'express';
import formidable from 'formidable';
import { IUser } from '../users/user.interface';
import { DocumentSubject } from './document.enum';
import { IDocument, IFormidableObj } from './document.interface';
import DocumentManager from './document.manager';

export default class DocumentController {
    static async getDocumentById(req: Request, res: Response) {
        const documentId = req.params.documentId as string;
        const foundDocument: IDocument = await DocumentManager.getDocumentById(documentId);
        res.json(foundDocument);
    }

    static async downloadDocumentById(req: Request, res: Response) {
        const documentId = req.params.documentId as string;
        await DocumentManager.downloadDocumentById(documentId, res);
    }

    static async getAllUserDocsBySub(req: Request, res: Response) {

        const loggedUser = String((req.user! as IUser)._id as string);
        const { userId } = req.query;
        const subject = decodeURI(req.query.subject as string);
        const userDocuments: IDocument[] = await DocumentManager.getAllUserDocsBySub(
            userId as string,
            subject as DocumentSubject,
            loggedUser
        );

        res.json(userDocuments);
    }

    static async getAllSelfDocsBySub(req: Request, res: Response) {

        const { userId } = req.query;
        const subject = decodeURI(req.query.subject as string);
        const userDocuments: IDocument[] = await DocumentManager.getAllSelfDocsBySub(
            userId as string,
            subject as DocumentSubject
        );

        res.json(userDocuments);
    }

    static async getAllDocumentsByUserId(req: Request, res: Response) {

        const { userId } = req.query;
        const userDocuments: IDocument[] = await DocumentManager.getAllDocumentsByUserId(userId as string);

        res.json(userDocuments);
    }

    static async createDocument(req: Request, res: Response) {
        const { userId } = req.params;
        const createdBy = req.user! as IUser;
        const form = formidable({ multiples: false });

        const formfields: IFormidableObj = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                    return;
                }

                // eslint-disable-next-line no-unreachable
                resolve({ fields, files });
            });
        });
        if (formfields instanceof Error) {
            throw formfields;
        }

        const addedDocument = await DocumentManager.createDocument(formfields, userId, createdBy);
        res.json(addedDocument);
    }

    static async updateDocumentById(req: Request, res: Response) {
        const documentId = req.params.documentId as string;
        const documentData = req.body as Partial<IDocument>;
        const updatedDocument = await DocumentManager.updateDocumentById(documentId, documentData);
        res.status(200).json(updatedDocument);
    }

    static async deleteDocumentById(req: Request, res: Response) {
        const documentId = req.params.documentId as string;
        const deletedDocument = await DocumentManager.deletedDocumentById(documentId);
        res.status(200).json(deletedDocument);
    }
}
