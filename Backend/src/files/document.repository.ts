import { IDocument } from './document.interface';
import DocumentModel from './document.model';
import { DocumentSubject } from './document.enum';
import { filterRelevantUsers } from '../utils/utils';

export default class DocumentRepository {
    static getDocumentById(documentId: string): Promise<IDocument | null> {
        const foundDocument: Promise<IDocument | null> = DocumentModel.findById(documentId).exec();
        return foundDocument;
    }

    static getAllDocumentsByUserId(userId: string) {
        const userDoucments: Promise<IDocument[] | null> = DocumentModel.find({ userId }).exec();
        return userDoucments;
    }

    static async getAllUserDocsBySub(userId: string, subject: DocumentSubject, connectedUserId: string) {
        console.log('not my self page', userId, connectedUserId);
        const groupManagers = await filterRelevantUsers(userId, connectedUserId);
        console.log('2222222222222222222222', groupManagers);

        const notPublicUserDoucments: IDocument[] | null = await DocumentModel.find({
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

        const publicUserDoucments: IDocument[] | null = await DocumentModel.find({
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

        if (!publicUserDoucments || !notPublicUserDoucments) return null;
        return notPublicUserDoucments.concat(publicUserDoucments);
    }

    static getAllSelfDocsBySub(userId: string, subject: DocumentSubject) {
        console.log(' my self page');

        const userDoucments: Promise<IDocument[] | null> = DocumentModel.find({
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

    static createDocument(newDocument: IDocument): Promise<IDocument | null> {
        const addedDocument: Promise<IDocument | null> = DocumentModel.create(newDocument);
        return addedDocument;
    }

    static updateDocumentById(documentId: string, documentData: Partial<IDocument>): Promise<IDocument | null> {
        const updatedDocument: Promise<IDocument | null> = DocumentModel.findByIdAndUpdate(documentId, documentData, {
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

    static deletedDocumentById(documentId: string): Promise<IDocument | null> {
        const deletedDocument: Promise<IDocument | null> = DocumentModel.findByIdAndDelete(documentId).exec();
        return deletedDocument;
    }
}
