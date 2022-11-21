"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const user_model_1 = __importDefault(require("../../../users/user.model"));
const pathToKey = path_1.default.join(__dirname, '../../../public/authKeys', 'id_rsa_pub.pem');
const PUB_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
const cookieExtractor = (req) => {
    let jwt = null;
    if (req && req.cookies) {
        jwt = req.cookies.jwtCookie;
    }
    return jwt;
};
// At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
const options = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
};
// app.js will pass the global passport object here, and this function will configure it
// The JWT payload is passed into the verify callback
exports.Strategy = new passport_jwt_1.default.Strategy(options, (jwtPayload, done) => {
    // We will assign the `sub` property on the JWT to the database ID of user
    user_model_1.default.findOne({ username: jwtPayload.sub }, (err, user) => {
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
