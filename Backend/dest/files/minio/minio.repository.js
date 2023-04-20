"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioRepository = void 0;
const utf8_1 = __importDefault(require("utf8"));
const fs_1 = require("fs");
const document_minio_server_1 = require("../document.minio.server");
const userError_1 = require("../../utils/errors/userError");
const config_1 = require("../../config");
class MinioRepository {
    static async getFileStreamByDocName(documentId, fileName, res) {
        const fileType = fileName.split('.').pop();
        document_minio_server_1.minioClient.getObject('documents', `${documentId}.${fileType}`, (err, objStream) => {
            if (err) {
                throw err;
            }
            console.log(fileName);
            res.setHeader('content-type', 'application/octet-stream');
            res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
            res.set({ 'Content-Disposition': `attachment; filename=${utf8_1.default.encode(fileName)}` });
            return objStream.pipe(res);
        });
    }
    static async uploadFileByDocId(documentId, fileType, filePath) {
        const documentName = `${String(documentId)}.${fileType}`;
        console.log(documentName);
        console.log(filePath);
        document_minio_server_1.minioClient.fPutObject(config_1.config.minio.bucketName, documentName, filePath, async (error) => {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log('uploaded successfully!');
            fs_1.promises.unlink(`${filePath}`)
                .then()
                .catch(() => {
                // Ask Almog if i should throw error here
                console.log(new userError_1.WrongFilePathError('File was uploaded, but not deleted from hard disk'));
                throw new userError_1.WrongFilePathError('File was uploaded, but not deleted from hard disk');
            });
        });
    }
    static async RemoveFileByDocId(document) {
        if (!document.fileName) {
            throw new userError_1.FileNameNotFoundError('Could not delet file because empty file name');
        }
        const filename = `${document._id}.${document.fileName.split('.').pop()}`;
        document_minio_server_1.minioClient.removeObject(config_1.config.minio.bucketName, filename, async (error) => {
            if (error) {
                console.log(error);
                throw error;
            }
            console.log('removed successfult');
        });
    }
}
exports.MinioRepository = MinioRepository;
