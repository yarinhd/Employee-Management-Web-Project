import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { appRouter } from './router';
import { userErrorHandler } from './utils/errors/errorHandler';
import { Strategy } from './utils/AuthenticationJWT/config/passport';
import { users } from './utils/people-api-mock/people-api';

// need to implement files structure at each feature!
export class Server {
    public app: express.Application;

    public static bootStrap(): Server {
        return new Server();
    }

    constructor() {
        this.app = express();
        this.app.use(cors({ credentials: true, origin: config.endpoints.clientUrl }));
        this.app.use(cookieParser());
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(express.json());
        passport.use(Strategy);
        this.app.use(passport.initialize());
        users.createUser();
        this.app.use(appRouter);
        this.app.use(userErrorHandler);
        this.app.listen(config.serverPort, () => {
        });
    }
}
