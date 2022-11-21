"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const mongoose_1 = __importDefault(require("mongoose"));
const minio = __importStar(require("minio"));
const config_1 = require("./config");
const server_1 = require("./server");
const serverError_1 = require("./utils/errors/serverError");
// Ask almog how to wrap it right!
(async () => {
    // shoudn't connect the db to the compositor. use is for authentication
    const connectionString = `${config_1.config.db.server}:${config_1.config.db.port}/${config_1.config.db.name}`;
    const minioClient = new minio.Client({
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: 'yarin',
        secretKey: 'yarayara',
    });
    mongoose_1.default
        .connect(connectionString)
        .then(() => {
        console.log(`[MongoDB] connected to port: ${config_1.config.db.port} --> V`);
    })
        .catch(() => {
        throw new serverError_1.MongoConnectionError('Failed to connect Mongo server!');
    });
    const bucketExist = await minioClient.bucketExists('documents');
    if (!bucketExist) {
        throw new serverError_1.MinioBucketError('Minio Bucket is not exist!');
    }
    console.log('Connectend to documents bucket successfuly!');
    const server = server_1.Server.bootStrap();
})();
