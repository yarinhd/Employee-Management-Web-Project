import express from 'express';
import { MongoServerError } from 'mongodb';
import { config } from '../../config';
import { ServerError } from './serverError';
import { UserError } from './userError';

export function userErrorHandler(
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    if (error instanceof UserError) {
        console.log(
            `\n Info: \n User Error \n ${error.name} was thrown with status: ${error.status} and message: ${error.message}`
        );
        res.status(error.status).send({
            type: error.name,
            message: error.message,
        });
        next();
    }
    if (error instanceof ServerError) {
        console.log(
            `\n Info: \n User Error \n ${error.name} was thrown with status: ${error.status} and message: ${error.message}`
        );
        res.status(error.status).send({
            type: error.name,
            message: error.message,
        });
        next();
    }
    if (error instanceof MongoServerError) {
        console.log(
            `\n Info: \n User Error \n ${error.name} was thrown with status: ${config.errors.serverError.status} and message: ${error.message}`
        );
        res.status(config.errors.serverError.status).send({
            type: error.name,
            message: error.message,
        });
        next();
    } else {
        next(error);
    }
}
