"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
const people_user_model_1 = __importDefault(require("./people_user.model"));
const peopleHeb_json_1 = __importDefault(require("./peopleHeb.json"));
class users {
    // add users
    static async createUser() {
        const addedPeopleUser = await people_user_model_1.default.create(peopleHeb_json_1.default);
        return addedPeopleUser;
    }
    // get user by username (t_yarin_h)
    static async getUser(username, fields) {
        console.log('username:', username);
        const user = await people_user_model_1.default.findOne({ username }).select('-__v -_id').lean().exec();
        if (user === null) {
            throw new Error();
        }
        return user;
    }
    // Note: fields should be type of UserField[] from People-Api package!
    static async getUsers(branch, fields) {
        const branchUsers = await people_user_model_1.default.find({ branch }).exec();
        if (users === null) {
            throw new Error();
        }
        return branchUsers;
    }
}
exports.users = users;
// static async check(req: Request, res: Response) {
//     const user = await PeopleApi.createUser();
//     console.log(user);
//     res.json(user);
//     }
//     static async checkk(req: Request, res: Response) {
//         const username =req.params.username;
//         console.log(username);
//         const user = await PeopleApi.getUser(username);
//         console.log(user);
//         res.json(user);
//         }
