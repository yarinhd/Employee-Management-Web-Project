"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const user_manager_1 = __importDefault(require("../../users/user.manager"));
const userError_1 = require("../errors/userError");
const people_api_1 = require("../people-api-mock/people-api");
const utils_1 = require("./lib/utils");
class authController {
    /**
     * @param {Request} req http request
     * @param {Response} res http response
     * @return {Object} json with details created user and token
     * user created based on people-Api db
     * token signed here after user creation (register allegedly happned when user connected to the computer)
     */
    static async userLogin(req, res) {
        // from soufAuth mock
        const userName = req.username;
        if (!userName) {
            throw new userError_1.UserIsNotConnectedError('User is not connected!');
        }
        const peopleApiUser = await people_api_1.users.getUser(userName, config_1.config.peopleApi.userFields);
        if (!peopleApiUser) {
            throw new userError_1.UserNotFoundError('User not found in People-API');
        }
        const user = await user_manager_1.default.upsertUserPersonalInfo(userName, peopleApiUser);
        if (!user.inGroup) {
            // TODO: check changes in whole groups! and update in accordance
        }
        const tokenObject = (0, utils_1.issueJWT)(user);
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
exports.default = authController;
