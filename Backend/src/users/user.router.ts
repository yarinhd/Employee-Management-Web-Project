import { Router } from 'express';
import { AuthMiddleware } from '../utils/AuthenticationJWT/lib/utils';
import { Validator } from '../utils/validations/validationMW';
import Wrapper from '../wrapper';
import UserController from './user.controller';

export const userRouter: Router = Router();

userRouter.post(
    '/upsertBranch/:branchName',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canCreateOrUpdateBranch),
    Wrapper.wrapAsync(UserController.upsertBranch)
);

userRouter.post('/cronUpsertBranch/:branchName', Wrapper.wrapAsync(UserController.upsertBranch));

userRouter.get('/myPakoodim', AuthMiddleware, Wrapper.wrapAsync(UserController.getMyPakoodim));
// get user by userId.
userRouter.get('/:userId', AuthMiddleware, Wrapper.wrapAsync(UserController.getUserByUserId));

// get myself user.
userRouter.get('/me', AuthMiddleware, Wrapper.wrapAsync(UserController.getMyUser));

// get user pakoodim.

// get all users of the same group
userRouter.get(
    '/groupUsers/:groupName',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canGetGroup),
    Wrapper.wrapAsync(UserController.getGroupUsers)
);

// update user by username
userRouter.put(
    '/:userId',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canDeletOrUpdateUser),
    Wrapper.wrapAsync(UserController.updateUserByUserId)
);

// delete user by username
userRouter.delete(
    '/:userId',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canDeletOrUpdateUser),
    Wrapper.wrapAsync(UserController.deleteUserByUserId)
);
