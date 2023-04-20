"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils/AuthenticationJWT/lib/utils");
const userAuth_1 = require("../utils/authMock/userAuth");
const validationMW_1 = require("../utils/validations/validationMW");
const wrapper_1 = __importDefault(require("../wrapper"));
const group_controller_1 = __importDefault(require("./group.controller"));
exports.groupRouter = (0, express_1.Router)();
// TODO: do it from user in group fields easy
// get Group  by group name.
exports.groupRouter.get('/:groupName', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetGroup), wrapper_1.default.wrapAsync(group_controller_1.default.getGroupByName));
// get all groups by parentId or groupName
exports.groupRouter.get('/', utils_1.AuthMiddleware, 
// TODO: see how you fix the authorization (in generally)
wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetParentGroup), wrapper_1.default.wrapAsync(group_controller_1.default.getAllGroupByFilter));
// get all groups by parentId or groupName
exports.groupRouter.get('/allBranch/cronRoute', wrapper_1.default.wrapAsync(group_controller_1.default.getAllExistBranches));
// update Group by group name.
exports.groupRouter.put('/', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canUpdateGroup), wrapper_1.default.wrapAsync(group_controller_1.default.updateGroupByName));
// delete Group by group name - deleting all sub-groups and related field in users (inGroup field).
exports.groupRouter.delete('/:groupName', userAuth_1.userAuth, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetGroup), wrapper_1.default.wrapAsync(group_controller_1.default.deleteGroupByName));
