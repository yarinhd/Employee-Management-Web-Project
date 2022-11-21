export class ServerError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
    }
}

export class MongoConnectionError extends ServerError {
    constructor(message: string) {
        super(message || 'Failed to connect Mongo server', 500);
    }
}

export class MinioBucketError extends ServerError {
    constructor(message: string) {
        super(message || 'Minio Bucket is not exist!', 500);
    }
}
