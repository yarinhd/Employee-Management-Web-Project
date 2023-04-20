"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils/AuthenticationJWT/lib/utils");
const validationMW_1 = require("../utils/validations/validationMW");
const wrapper_1 = __importDefault(require("../wrapper"));
const document_controller_1 = __importDefault(require("./document.controller"));
exports.documentRouter = (0, express_1.Router)();
// download Document by docuemntId
exports.documentRouter.get('/download/:documentId', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetDocument), wrapper_1.default.wrapAsync(document_controller_1.default.downloadDocumentById));
// get all Documents of user by subject and username
exports.documentRouter.get('/', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetAllDocument), wrapper_1.default.wrapAsync(document_controller_1.default.getAllUserDocsBySub));
// TODO:change route name and general checks again
// get all Documents of user by subject and username
exports.documentRouter.get('/myProfile/', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetAllDocument), wrapper_1.default.wrapAsync(document_controller_1.default.getAllSelfDocsBySub));
// get document by documentId
exports.documentRouter.get('/:documentId', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetDocument), wrapper_1.default.wrapAsync(document_controller_1.default.getDocumentById));
// get all Documents of user by username
exports.documentRouter.get('/', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetAllDocument), wrapper_1.default.wrapAsync(document_controller_1.default.getAllDocumentsByUserId));
// create Document
// TODO:UserAuth not working with formidable
exports.documentRouter.post('/:userId', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canCreateDocument), wrapper_1.default.wrapAsync(document_controller_1.default.createDocument));
// update Document by documentId
// TODO: cover youself for updating part of the fields - do checks
exports.documentRouter.put('/:documentId', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canUpdateDeleteDocument), wrapper_1.default.wrapAsync(document_controller_1.default.updateDocumentById));
// delete Document by documentId
exports.documentRouter.delete('/:documentId', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canUpdateDeleteDocument), wrapper_1.default.wrapAsync(document_controller_1.default.deleteDocumentById));
