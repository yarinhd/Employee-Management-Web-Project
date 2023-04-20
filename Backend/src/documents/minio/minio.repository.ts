import { Response } from 'express';
import utf8 from 'utf8';
import { promises as fs } from 'fs';
import { FileNameNotFoundError, WrongFilePathError } from '../../utils/errors/userError';
import { config } from '../../config';
import { IDocument } from '../document.interface';
import { minioClient } from '../..';

export class MinioRepository {
    static async getFileStreamByDocName(documentId: string, fileName: string, res: Response) {
        const fileType: string = fileName.split('.').pop() as string;
        minioClient.getObject(config.minio.bucketName, `${documentId}.${fileType}`, (err, objStream) => {
            if (err) {
                throw err;
            }
            res.setHeader('content-type', 'application/octet-stream');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
            res.set({ 'Content-Disposition': `attachment; filename=${utf8.encode(fileName)}` });
            return objStream.pipe(res);
        });
    }

    static async uploadFileByDocId(documentId: string, fileType: string, filePath: string) {
        const documentName = `${String(documentId)}.${fileType}`;
        minioClient.fPutObject(config.minio.bucketName, documentName, filePath, async (error: Error) => {
            if (error) {
                throw error;
            }
            fs.unlink(`${filePath}`)
                .then()
                .catch(() => {
                    throw new WrongFilePathError('File was uploaded, but not deleted from hard disk');
                });
        });
    }

    static async RemoveFileByDocId(document: IDocument) {
        if (!document.fileName) {
            throw new FileNameNotFoundError('Could not delet file because empty file name');
        }
        const filename: string = `${document._id}.${document.fileName.split('.').pop()}` as string;
        minioClient.removeObject(config.minio.bucketName, filename, async (error: Error | null) => {
            if (error) {
                throw error;
            }
        });
    }
}
