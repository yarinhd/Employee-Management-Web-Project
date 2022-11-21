import { Router } from 'express';
import Wrapper from '../../wrapper';
import authController from './authentication.controller';
import { soufAuth } from './souf-Auth/soufAuthMW_mock';

export const authRouter: Router = Router();

// signing token for user based on former connection to the computer user
// user name  is coupled to the request before signing the with soufAuth MW
authRouter.get('/login', soufAuth.kerberosAuth, Wrapper.wrapAsync(authController.userLogin));
