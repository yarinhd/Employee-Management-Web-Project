import { Request, Response } from 'express';
import { config } from '../../config';
import { IUser } from '../../users/user.interface';
import UserManager from '../../users/user.manager';
import { UserIsNotConnectedError, UserNotFoundError } from '../errors/userError';
import { users } from '../people-api-mock/people-api';
import { IPeopleUser } from '../people-api-mock/people_user.interface';
import { ICookie } from './lib/auth.interface';
import { issueJWT } from './lib/utils';

export default class authController {
    /**
     * @param {Request} req http request
     * @param {Response} res http response
     * @return {Object} json with details created user and token
     * user created based on people-Api db
     * token signed here after user creation (register allegedly happned when user connected to the computer)
     */
    static async userLogin(req: Request, res: Response) {
        // from soufAuth mock
        const userName: string | undefined = req.username;
        if (!userName) {
            throw new UserIsNotConnectedError('User is not connected!');
        }
        const peopleApiUser: IPeopleUser = await users.getUser(userName, config.peopleApi.userFields);
        if (!peopleApiUser) {
            throw new UserNotFoundError('User not found in People-API');
        }
        const user: IUser = await UserManager.upsertUserPersonalInfo(userName, peopleApiUser);
        if (!user.inGroup) {
            // TODO: check changes in whole groups! and update in accordance
        }
        const tokenObject: ICookie = issueJWT(user);
        res.cookie(tokenObject.cookieName, tokenObject.token, {
            httpOnly: true,
            expires: tokenObject.expiresDate,
            secure: false,
        });
        res.status(200).json({
            user,
        });
    }
}
