"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { IUser } from '../users/user.interface';
const userError_1 = require("../utils/errors/userError");
const group_manager_1 = __importDefault(require("./group.manager"));
class GroupController {
    static async getGroupByName(req, res) {
        const { groupName } = req.params;
        const groupFound = await group_manager_1.default.getGroupByName(groupName);
        res.status(200).json(groupFound);
    }
    static async getAllGroupByFilter(req, res) {
        const { groupName, parentName } = req.query;
        if ((groupName && parentName) || (!groupName && !parentName)) {
            throw new userError_1.WrongFilterInputError('More than one filter sent or filter name not valid');
        }
        const filter = { groupName, parentName };
        const subGroups = await group_manager_1.default.getAllGroupByFilter(filter);
        res.json(subGroups);
    }
    static async getAllExistBranches(req, res) {
        const allBranches = await group_manager_1.default.getAllExistBranches();
        res.json(allBranches);
    }
    static async updateGroupByName(req, res) {
        const groupName = req.query.groupName;
        const action = req.query.action;
        const groupData = req.body;
        // not sure -need to check
        const updatedGroup = await group_manager_1.default.updateGroupByName(groupName, groupData, action);
        res.status(200).json(updatedGroup);
    }
    static async deleteGroupByName(req, res) {
        const { groupName } = req.params;
        const deletedGroup = await group_manager_1.default.deletedGroupByName(groupName);
        res.status(200).json(deletedGroup);
    }
}
exports.default = GroupController;
