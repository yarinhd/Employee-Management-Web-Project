import jwtStrategy, { StrategyOptions } from 'passport-jwt';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
import UserModel from '../../../users/user.model';
import { IUser } from '../../../users/user.interface';

const pathToKey = path.join(__dirname, '../../../public/authKeys', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');

const cookieExtractor = (req: Request) => {
    let jwt = null;

    if (req && req.cookies) {
        jwt = req.cookies.jwtCookie;
    }

    return jwt;
};

const options: StrategyOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
};

export const Strategy: jwtStrategy.Strategy = new jwtStrategy.Strategy(options, (jwtPayload, done) => {
    UserModel.findOne({ username: jwtPayload.sub }, (err: Error, user: IUser) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }

        return done(null, false);
    });
});
