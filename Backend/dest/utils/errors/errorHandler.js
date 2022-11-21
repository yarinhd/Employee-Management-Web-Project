"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userErrorHandler = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../../config");
const serverError_1 = require("./serverError");
const userError_1 = require("./userError");
function userErrorHandler(error, req, res, next) {
    if (error instanceof userError_1.UserError) {
        console.log(`\n Info: \n User Error \n ${error.name} was thrown with status: ${error.status} and message: ${error.message}`);
        res.status(error.status).send({
            type: error.name,
            message: error.message,
        });
        next();
    }
    if (error instanceof serverError_1.ServerError) {
        console.log(`\n Info: \n User Error \n ${error.name} was thrown with status: ${error.status} and message: ${error.message}`);
        res.status(error.status).send({
            type: error.name,
            message: error.message,
        });
        next();
    }
    if (error instanceof mongodb_1.MongoServerError) {
        console.log(`\n Info: \n User Error \n ${error.name} was thrown with status: ${config_1.config.errors.serverError.status} and message: ${error.message}`);
        res.status(config_1.config.errors.serverError.status).send({
            type: error.name,
            message: error.message,
        });
        next();
    }
    else {
        next(error);
    }
}
exports.userErrorHandler = userErrorHandler;
