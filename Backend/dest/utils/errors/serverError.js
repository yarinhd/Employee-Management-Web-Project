"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioBucketError = exports.MongoConnectionError = exports.ServerError = void 0;
class ServerError extends Error {
    constructor(message, status) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
    }
}
exports.ServerError = ServerError;
class MongoConnectionError extends ServerError {
    constructor(message) {
        super(message || 'Failed to connect Mongo server', 500);
    }
}
exports.MongoConnectionError = MongoConnectionError;
class MinioBucketError extends ServerError {
    constructor(message) {
        super(message || 'Minio Bucket is not exist!', 500);
    }
}
exports.MinioBucketError = MinioBucketError;
