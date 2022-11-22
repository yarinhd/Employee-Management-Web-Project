'use strict';
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.authRouter = void 0;
const express_1 = require('express');
const wrapper_1 = __importDefault(require('../../wrapper'));
const authentication_controller_1 = __importDefault(require('./authentication.controller'));
const AuthMW_mock_1 = require('./Auth/AuthMW_mock');
exports.authRouter = (0, express_1.Router)();
// signing token for user based on former connection to the computer user
// user name  is coupled to the request before signing the with Auth MW
exports.authRouter.get(
    '/login',
    AuthMW_mock_1.Auth.kerberosAuth,
    wrapper_1.default.wrapAsync(authentication_controller_1.default.userLogin)
);
