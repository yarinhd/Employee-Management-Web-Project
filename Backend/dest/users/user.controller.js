"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_manager_1 = __importDefault(require("./user.manager"));
class UserController {
    // static async updateBranch(req: Request, res: Response) {
    //     const { branchName } = req.params;
    //     const updatedBranch = await UserManager.updateBranch(branchName);
    //     res.json(updatedBranch);
    // }
    static async upsertBranch(req, res) {
        const { branchName } = req.params;
        const upsertedBranch = await user_manager_1.default.upsertBranch(branchName);
        res.json(upsertedBranch);
    }
    static async getGroupUsers(req, res) {
        const { groupName } = req.params;
        const groupUsers = await user_manager_1.default.getGroupUsers(groupName);
        res.json(groupUsers);
    }
    static async getUserByUserId(req, res) {
        console.log('aaa');
        const { userId } = req.params;
        const searchResult = await user_manager_1.default.getUserByUserId(userId);
        console.log(searchResult);
        res.status(200).json(searchResult);
    }
    static async getMyUser(req, res) {
        res.status(200).json(req.user);
    }
    static async getMyPakoodim(req, res) {
        const loggedUser = req.user;
        const pakoodim = await user_manager_1.default.getMyPakoodimByUserId(loggedUser);
        console.log(pakoodim);
        res.status(200).json(pakoodim);
    }
    static async updateUserByUserId(req, res) {
        const userId = req.params.userId;
        const userData = req.body;
        const updatedUser = await user_manager_1.default.updateUserByUserId(userId, userData);
        res.status(200).json(updatedUser);
    }
    static async deleteUserByUserId(req, res) {
        const userId = req.params.userId;
        const deletedUser = await user_manager_1.default.deletedUserByUserId(userId);
        res.status(200).json(deletedUser);
    }
}
exports.default = UserController;
