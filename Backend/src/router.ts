import { Router } from 'express';
import { documentRouter } from './files/document.router';
import { groupRouter } from './groups/group.router';
import { noteRouter } from './notes/note.router';
import { userRouter } from './users/user.router';
import { authRouter } from './utils/AuthenticationJWT/authentication.router';

export const appRouter: Router = Router();

appRouter.use('/api/auth', authRouter);
appRouter.use('/api/user', userRouter);
appRouter.use('/api/group', groupRouter);
appRouter.use('/api/note', noteRouter);
appRouter.use('/api/document', documentRouter);
