"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = exports.issueJWT = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pathToKey = path_1.default.join(__dirname, '../../../public/authKeys', 'id_rsa_priv.pem');
const PRIV_KEY = fs_1.default.readFileSync(pathToKey, 'utf8');
/**
 * @param {IUser} user db user
 * @return {ICookie} token details after creating tokent with private key
 */
function issueJWT(user) {
    const username = user.username;
    const expiresIn = +'6000000';
    const payload = {
        sub: username,
        iat: Date.now(),
    };
    const signedToken = jsonwebtoken_1.default.sign(payload, PRIV_KEY, {
        expiresIn,
        algorithm: 'RS256',
    });
    const cookieDetails = {
        cookieName: 'jwtCookie',
        expiresDate: new Date(Date.now() + expiresIn),
        token: signedToken,
    };
    return cookieDetails;
}
exports.issueJWT = issueJWT;
/**
 * @param {Request} req http request
 * @param {Response} res db http response
 * @return {NextFunction} using passport strategy - checking authentication with jwt token
 */
async function AuthMiddleware(req, res, next) {
    passport_1.default.authenticate('jwt', { session: false })(req, res, next);
}
exports.AuthMiddleware = AuthMiddleware;
