/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import * as minio from 'minio';
import { config } from './config';
import { Server } from './server';
import { MinioBucketError, MongoConnectionError } from './utils/errors/serverError';

export const minioClient = new minio.Client({
    endPoint: config.minio.server,
    port: config.minio.port,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER || 'yarin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'yarayara',
});

(async () => {
    const connectionString = `${config.db.server}:${config.db.port}/${config.db.name}`;

    mongoose
        .connect(connectionString)
        .then(() => {
        })
        .catch(() => {
            throw new MongoConnectionError('Failed to connect Mongo server!');
        });

    const bucketExist = await minioClient.bucketExists(config.minio.bucketName);

    if (!bucketExist) {
        minioClient.makeBucket(config.minio.bucketName, 'us-east-1', (err) => {
            if (err) {
                throw err;
            }
        });
    }

    const server: Server = Server.bootStrap();
})();
