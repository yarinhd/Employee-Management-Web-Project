import { Router } from 'express';
import { AuthMiddleware } from '../utils/AuthenticationJWT/lib/utils';
import { Validator } from '../utils/validations/validationMW';
import Wrapper from '../wrapper';
import DocumentController from './document.controller';

export const documentRouter = Router();

// download Document by docuemntId
documentRouter.get(
    '/download/:documentId',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canGetDocument),
    Wrapper.wrapAsync(DocumentController.downloadDocumentById)
);

// get all Documents of user by subject and username
documentRouter.get(
    '/',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canGetAllDocument),
    Wrapper.wrapAsync(DocumentController.getAllUserDocsBySub)
);

// get all Documents of user by subject and username
documentRouter.get(
    '/myProfile/',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canGetAllDocument),
    Wrapper.wrapAsync(DocumentController.getAllSelfDocsBySub)
);

// get document by documentId
documentRouter.get(
    '/:documentId',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canGetDocument),
    Wrapper.wrapAsync(DocumentController.getDocumentById)
);

// get all Documents of user by username
documentRouter.get(
    '/',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canGetAllDocument),
    Wrapper.wrapAsync(DocumentController.getAllDocumentsByUserId)
);

// create Document
documentRouter.post(
    '/:userId',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canCreateDocument),
    Wrapper.wrapAsync(DocumentController.createDocument)
);

// update Document by documentId
documentRouter.put(
    '/:documentId',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canUpdateDeleteDocument),
    Wrapper.wrapAsync(DocumentController.updateDocumentById)
);

// delete Document by documentId
documentRouter.delete(
    '/:documentId',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canUpdateDeleteDocument),
    Wrapper.wrapAsync(DocumentController.deleteDocumentById)
);
