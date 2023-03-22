import { Router } from 'express';
import { AuthMiddleware } from '../utils/AuthenticationJWT/lib/utils';
import { userAuth } from '../utils/authMock/userAuth';
import { Validator } from '../utils/validations/validationMW';
import Wrapper from '../wrapper';
import GroupController from './group.controller';

export const groupRouter = Router();

// get Group  by group name.
groupRouter.get(
    '/:groupName',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canGetGroup),
    Wrapper.wrapAsync(GroupController.getGroupByName)
);

// get all groups by parentId or groupName
groupRouter.get(
    '/',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canGetParentGroup),
    Wrapper.wrapAsync(GroupController.getAllGroupByFilter)
);

// get all groups by parentId or groupName
groupRouter.get('/allBranch/cronRoute', Wrapper.wrapAsync(GroupController.getAllExistBranches));

// update Group by group name.
groupRouter.put(
    '/',
    AuthMiddleware,
    Wrapper.wrapAsync(Validator.canUpdateGroup),
    Wrapper.wrapAsync(GroupController.updateGroupByName)
);

// delete Group by group name - deleting all sub-groups and related field in users (inGroup field).
groupRouter.delete(
    '/:groupName',
    userAuth,
    Wrapper.wrapAsync(Validator.canGetGroup),
    Wrapper.wrapAsync(GroupController.deleteGroupByName)
);
