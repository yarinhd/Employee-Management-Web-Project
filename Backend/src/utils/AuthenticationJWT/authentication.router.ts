import { Router } from 'express';
import Wrapper from '../../wrapper';
import authController from './authentication.controller';
import { Auth } from './Auth/AuthMW_mock';

export const authRouter: Router = Router();

// signing token for user based on former connection to the computer user
// user name  is coupled to the request before signing the with Auth MW
authRouter.get('/login', Auth.kerberosAuth, Wrapper.wrapAsync(authController.userLogin));
