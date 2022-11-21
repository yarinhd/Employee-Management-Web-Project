/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import * as minio from 'minio';
import { config } from './config';
import { Server } from './server';
import { MinioBucketError, MongoConnectionError } from './utils/errors/serverError';

// Ask almog how to wrap it right!
export const minioClient = new minio.Client({
    endPoint: config.minio.server,
    // endPoint: 'localhost',
    port: config.minio.port,
    useSSL: false,
    accessKey: process.env.MINIO_ROOT_USER || 'yarin',
    secretKey: process.env.MINIO_ROOT_PASSWORD || 'yarayara',
});

(async () => {
    // shoudn't connect the db to the compositor. use is for authentication
    const connectionString = `${config.db.server}:${config.db.port}/${config.db.name}`;
    console.log(connectionString);

    mongoose
        .connect(connectionString)
        .then(() => {
            console.log(`[MongoDB] connected to port: ${config.db.port} --> V`);
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
            console.log('Bucket created successfully in "us-east-1".');
        });
    }
    // const data: any = [];
    // const stream = minioClient.listObjects(config.minio.bucketName, '', true);
    // stream.on('data', (obj) => {
    //     data.push(obj);
    // });
    // stream.on('end', () => {
    //     console.log(data);
    // });
    // stream.on('error', (err) => {
    //     console.log(err);
    // });
    // console.log('Connectend to documents bucket successfuly!');

    const server: Server = Server.bootStrap();
})();
