import { NextFunction, Request, Response } from 'express';
import { config } from '../../config';
import { IDocument } from '../../documents/document.interface';
import DocumentManager from '../../documents/document.manager';
import INote from '../../notes/note.interface';
import NoteManager from '../../notes/note.manager';
import { IUser } from '../../users/user.interface';
import { MissingParamsError, UnAuthorizedError } from '../errors/userError';
import { users } from '../people-api-mock/people-api';
// eslint-disable-next-line import/no-unresolved
import {
    isCreatedByLoggedUser,
    isManagerByGroupName,
    isManagerAndNotSelfUser,
    isManagerOrUserByUserId,
} from './validationUtils';

export class Validator {
    static async canDeletOrUpdateUser(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const { userId } = req.params;
        await isManagerAndNotSelfUser(loggedUser, userId);
        next();
    }

    static async canGetGroup(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const { groupName } = req.params;
        await isManagerByGroupName(loggedUser, groupName);
        next();
    }

    static async canCreateOrUpdateBranch(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const { branchManager } = await users.getUser(loggedUser.username, config.peopleApi.UserAndGroupfields);
        if (branchManager !== loggedUser.username) {
            throw new UnAuthorizedError('user is Unauthorized - only branch manager can use this api!');
        }
        next();
    }

    static async canUpdateGroup(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const groupName: string | null = req.query.groupName as string | null;
        await isManagerByGroupName(loggedUser, groupName);
        next();
    }

    static async canGetParentGroup(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const parentName: string | null = req.query.parentName as string | null;
        const groupName: string | null = req.query.groupName as string | null;
        if (!parentName) {
            if (!groupName) {
                throw new MissingParamsError('missing parametes - query should have parenId/groupName fields');
            }
            await isManagerByGroupName(loggedUser, groupName);
            next();
            return;
        }
        await isManagerByGroupName(loggedUser, parentName);
        next();
    }

    static async canGetNote(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const { noteId } = req.params;
        const noteUserId: string = ((await NoteManager.getNotePopulatedById(noteId)) as INote).userId as string;
        await isManagerOrUserByUserId(loggedUser, noteUserId);
        next();
    }

    static async canGetAllNote(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;

        const userId = req.query.userId as string;
        await isManagerOrUserByUserId(loggedUser, userId);
        next();
    }

    static async canCreateNote(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const { userId } = req.params;
        await isManagerAndNotSelfUser(loggedUser, userId);
        next();
    }

    static async canUpdateDeleteNote(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const { noteId } = req.params;
        const noteCreatorUserId: string = ((await NoteManager.getNoteById(noteId)) as INote).createdBy as string;

        await isCreatedByLoggedUser(loggedUser, noteCreatorUserId);
        next();
    }

    static async canGetDocument(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const { documentId } = req.params;
        const documentUserId: string = ((await DocumentManager.getDocumentById(documentId)) as IDocument)
            .userId as string;
        await isManagerOrUserByUserId(loggedUser, documentUserId);
        next();
    }

    static async canGetAllDocument(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const documentUserId = req.query.userId as string;
        await isManagerOrUserByUserId(loggedUser, documentUserId);
        next();
    }

    static async canCreateDocument(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const { userId } = req.params;
        await isManagerAndNotSelfUser(loggedUser, userId);
        next();
    }

    static async canUpdateDeleteDocument(req: Request, res: Response, next: NextFunction) {
        const loggedUser: IUser = req.user! as IUser;
        const { documentId } = req.params;
        const documentUserId: string = ((await DocumentManager.getDocumentById(documentId)) as IDocument)
            .createdBy as string;
        await isCreatedByLoggedUser(loggedUser, documentUserId);
        next();
    }
}
