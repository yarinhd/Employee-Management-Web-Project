import { Response } from 'express';
import formidable from 'formidable';
import { MinioRepository } from './minio/minio.repository';
import { DocumentNotFoundError, FileNotUploadedError, WrongInputSubjectError } from '../utils/errors/userError';
import { IDocument, IFormidableObj } from './document.interface';
import DocumentRepository from './document.repository';
import UserManager from '../users/user.manager';
import { DocumentSubject } from './document.enum';
import { IUser } from '../users/user.interface';

export default class DocumentManager {
    /**
     * @param {string} documentId document Id as PK
     * @return {IDocument} found document json
     */
    static async getDocumentById(documentId: string) {
        const foundDocument = await DocumentRepository.getDocumentById(documentId);
        if (!foundDocument) {
            throw new DocumentNotFoundError('Document not found - failed while searching document');
        }
        return foundDocument;
    }

    /**
     * @param {string} documentId document Id as PK
     * @param {Response} res response for the request
     * @return {IDocument} found document file download (using minio - S3)
     */
    static async downloadDocumentById(documentId: string, res: Response) {
        console.log('hohohohoohoho');

        const foundDocument = await DocumentRepository.getDocumentById(documentId);
        if (!foundDocument) {
            throw new DocumentNotFoundError('Document not found - failed while searching document');
        }
        await MinioRepository.getFileStreamByDocName(String(documentId), foundDocument.fileName as string, res);

        // return foundDocument;
    }

    /**
     * @param {string} userId user Id as PK
     * @return {IDocument[]} all document related to userId
     */
    static async getAllDocumentsByUserId(userId: string) {
        await UserManager.getUserByUserId(userId);
        const userDocuments: IDocument[] | null = await DocumentRepository.getAllDocumentsByUserId(userId);
        if (!userDocuments) {
            throw new DocumentNotFoundError('Document not found - failed while searching document');
        }
        return userDocuments;
    }

    /**
     * @param {string} userId user Id as PK
     * @param {DocumentSubject} subject enum subject of the document
     * @return {IDocument[]} all document related to userId and subject
     */

    static async getAllUserDocsBySub(userId: string, subject: DocumentSubject, connectedUserId: string) {
        console.log(`userId: ${userId}, subject:${subject}`);

        await UserManager.getUserByUserId(userId);
        if (!Object.values(DocumentSubject as object).includes(subject)) {
            throw new WrongInputSubjectError('Subject is not exist - choose option from the box');
        }
        const userDocuments: IDocument[] | null = await DocumentRepository.getAllUserDocsBySub(
            userId,
            subject,
            connectedUserId
        );
        if (!userDocuments) {
            throw new DocumentNotFoundError('Document not found - failed while searching document');
        }
        return userDocuments;
    }

    /**
     * @param {string} userId user Id as PK
     * @param {DocumentSubject} subject enum subject of the document
     * @return {IDocument[]} all document related to userId and subject
     */

    static async getAllSelfDocsBySub(userId: string, subject: DocumentSubject) {
        console.log(`userId: ${userId}, subject:${subject}`);

        await UserManager.getUserByUserId(userId);
        if (!Object.values(DocumentSubject as object).includes(subject)) {
            throw new WrongInputSubjectError('Subject is not exist - choose option from the box');
        }
        const userDocuments: IDocument[] | null = await DocumentRepository.getAllSelfDocsBySub(userId, subject);
        if (!userDocuments) {
            throw new DocumentNotFoundError('Document not found - failed while searching document');
        }
        return userDocuments;
    }

    /**
     * @param {string} userId user Id as PK
     * @param {IFormidableObj} formfields parsed request fileds and files
     * @return {IDocument[]} created document after uploading file to minio and doc creation
     */
    static async createDocument(formfields: IFormidableObj, userId: string, createdBy: IUser) {
        if (!formfields.files.upload) {
            throw new FileNotUploadedError('File not uploaded');
        }
        if (!Object.values(DocumentSubject as object).includes(formfields.fields.subject)) {
            throw new WrongInputSubjectError('Subject is not exist - choose option from the box');
        }
        await UserManager.getUserByUserId(userId);
        console.log(`formfields: ${JSON.stringify(formfields.fields)}`);

        const DocumentData: IDocument = {
            userId,
            subject: formfields.fields.subject as DocumentSubject,
            hidden: formfields.fields.hidden === 'true',
            createdBy,
            fileName: (formfields.files.upload as formidable.File).originalFilename as string,
        };

        const filePath: string = (formfields.files.upload as formidable.File).filepath;
        const addedDocument = await DocumentRepository.createDocument(DocumentData);
        if (!addedDocument) {
            throw new DocumentNotFoundError('Couldnt create Document - failed to create document');
        }
        await MinioRepository.uploadFileByDocId(
            addedDocument._id as string,
            addedDocument.fileName?.split('.').pop() as string,
            filePath
        );
        return addedDocument;
    }

    /**
     * @param {string} documentId docuument Id as PK
     * @param {Partial<IDocument>} documentData document data for update
     * @return {IDocument} updated document based on document data
     */
    static async updateDocumentById(documentId: string, documentData: Partial<IDocument>) {
        const updatedDocument = await DocumentRepository.updateDocumentById(documentId, documentData);
        if (!updatedDocument) {
            throw new DocumentNotFoundError('Document not found - failed to update document');
        }
        return updatedDocument;
    }

    /**
     * @param {string} documentId docuument Id as PK
     * @return {IDocument} deleted document data based on document id + deletion of document file from minio
     */
    static async deletedDocumentById(documentId: string) {
        const deletedDocument = await DocumentRepository.deletedDocumentById(documentId);
        if (!deletedDocument) {
            throw new DocumentNotFoundError('Document not found - failed to delete document');
        }
        MinioRepository.RemoveFileByDocId(deletedDocument);
        return deletedDocument;
    }
}
