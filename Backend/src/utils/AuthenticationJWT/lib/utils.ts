import path from 'path';
import fs from 'fs';
import passport from 'passport';
import jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { IPayload, ICookie } from './auth.interface';
import { IUser } from '../../../users/user.interface';

const pathToKey = path.join(__dirname, '../../../public/authKeys', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * @param {IUser} user db user
 * @return {ICookie} token details after creating tokent with private key
 */
export function issueJWT(user: IUser) {
    const username = user.username as string;

    const expiresIn = +'6000000';

    const payload: IPayload = {
        sub: username,
        iat: Date.now(),
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn,
        algorithm: 'RS256',
    });

    const cookieDetails: ICookie = {
        cookieName: 'jwtCookie',
        expiresDate: new Date(Date.now() + expiresIn),
        token: signedToken,
    };
    return cookieDetails;
}

/**
 * @param {Request} req http request
 * @param {Response} res db http response
 * @return {NextFunction} using passport strategy - checking authentication with jwt token
 */
export async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false })(req, res, next);
}
