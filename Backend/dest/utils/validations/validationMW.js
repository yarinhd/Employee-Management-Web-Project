"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validator = void 0;
const config_1 = require("../../config");
const document_manager_1 = __importDefault(require("../../files/document.manager"));
const note_manager_1 = __importDefault(require("../../notes/note.manager"));
const userError_1 = require("../errors/userError");
const people_api_1 = require("../people-api-mock/people-api");
// eslint-disable-next-line import/no-unresolved
const validationUtils_1 = require("./validationUtils");
class Validator {
    static async canDeletOrUpdateUser(req, res, next) {
        const loggedUser = req.user;
        const { userId } = req.params;
        await (0, validationUtils_1.isManagerAndNotSelfUser)(loggedUser, userId);
        next();
    }
    static async canGetGroup(req, res, next) {
        const loggedUser = req.user;
        const { groupName } = req.params;
        await (0, validationUtils_1.isManagerByGroupName)(loggedUser, groupName);
        next();
    }
    static async canCreateOrUpdateBranch(req, res, next) {
        const loggedUser = req.user;
        // TODO: can change the config to specific fields of branchManager only
        const { branchManager } = await people_api_1.users.getUser(loggedUser.username, config_1.config.peopleApi.UserAndGroupfields);
        if (branchManager !== loggedUser.username) {
            throw new userError_1.UnAuthorizedError('user is Unauthorized - only branch manager can use this api!');
        }
        next();
    }
    static async canUpdateGroup(req, res, next) {
        const loggedUser = req.user;
        const groupName = req.query.groupName;
        await (0, validationUtils_1.isManagerByGroupName)(loggedUser, groupName);
        next();
    }
    static async canGetParentGroup(req, res, next) {
        const loggedUser = req.user;
        const parentName = req.query.parentName;
        const groupName = req.query.groupName;
        if (!parentName) {
            if (!groupName) {
                throw new userError_1.MissingParamsError('missing parametes - query should have parenId/groupName fields');
            }
            await (0, validationUtils_1.isManagerByGroupName)(loggedUser, groupName);
            next();
            return;
        }
        await (0, validationUtils_1.isManagerByGroupName)(loggedUser, parentName);
        next();
    }
    static async canGetNote(req, res, next) {
        const loggedUser = req.user;
        const { noteId } = req.params;
        const noteUserId = (await note_manager_1.default.getNotePopulatedById(noteId)).userId;
        await (0, validationUtils_1.isManagerOrUserByUserId)(loggedUser, noteUserId);
        next();
    }
    static async canGetAllNote(req, res, next) {
        const loggedUser = req.user;
        const userId = req.query.userId;
        await (0, validationUtils_1.isManagerOrUserByUserId)(loggedUser, userId);
        next();
    }
    static async canCreateNote(req, res, next) {
        const loggedUser = req.user;
        const { userId } = req.params;
        await (0, validationUtils_1.isManagerAndNotSelfUser)(loggedUser, userId);
        next();
    }
    static async canUpdateDeleteNote(req, res, next) {
        const loggedUser = req.user;
        const { noteId } = req.params;
        const noteCreatorUserId = (await note_manager_1.default.getNoteById(noteId)).createdBy;
        await (0, validationUtils_1.isCreatedByLoggedUser)(loggedUser, noteCreatorUserId);
        next();
    }
    static async canGetDocument(req, res, next) {
        const loggedUser = req.user;
        const { documentId } = req.params;
        const documentUserId = (await document_manager_1.default.getDocumentById(documentId))
            .userId;
        await (0, validationUtils_1.isManagerOrUserByUserId)(loggedUser, documentUserId);
        next();
    }
    static async canGetAllDocument(req, res, next) {
        const loggedUser = req.user;
        const documentUserId = req.query.userId;
        await (0, validationUtils_1.isManagerOrUserByUserId)(loggedUser, documentUserId);
        next();
    }
    static async canCreateDocument(req, res, next) {
        const loggedUser = req.user;
        const { userId } = req.params;
        await (0, validationUtils_1.isManagerAndNotSelfUser)(loggedUser, userId);
        next();
    }
    static async canUpdateDeleteDocument(req, res, next) {
        const loggedUser = req.user;
        const { documentId } = req.params;
        const documentUserId = (await document_manager_1.default.getDocumentById(documentId))
            .createdBy;
        await (0, validationUtils_1.isCreatedByLoggedUser)(loggedUser, documentUserId);
        next();
    }
}
exports.Validator = Validator;
// TODO: ask almog why is that working like this? not async and when i throw the err it catch
// Why it is working without Wrapper? not understand this
// TODO: ask almog is that ok to use req.user like this? cause it is not a propery of req by origin
// TODO: Ask almog how can it work with try catch? intrestiong cause the wrapAsync is Async
// TODO: ask almog is that ok to use req.user like this? cause it is not a propery of req by origin
