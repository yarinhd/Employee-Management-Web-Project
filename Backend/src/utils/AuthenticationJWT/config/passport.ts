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

// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options: StrategyOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
};

// app.js will pass the global passport object here, and this function will configure it
// The JWT payload is passed into the verify callback
export const Strategy: jwtStrategy.Strategy = new jwtStrategy.Strategy(options, (jwtPayload, done) => {
    // We will assign the `sub` property on the JWT to the database ID of user
    UserModel.findOne({ username: jwtPayload.sub }, (err: Error, user: IUser) => {
        // This flow look familiar?  It is the same as when we implemented
        // the `passport-local` strategy
        if (err) {
            console.log('error to authenticate');

            return done(err, false);
        }
        if (user) {
            console.log('returning populated user');

            return done(null, user);
        }
        console.log('asdasdasas');

        return done(null, false);
    });
});
