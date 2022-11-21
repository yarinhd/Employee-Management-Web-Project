"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils/utils");
const group_model_1 = __importDefault(require("./group.model"));
class GroupRepository {
    static getGroupByNamePopulated(name) {
        const foundGroup = group_model_1.default.findOne({ name })
            .populate({ path: 'usersId', model: 'User' })
            .exec();
        return foundGroup;
    }
    static getAllExistBranches() {
        const foundGroup = group_model_1.default.find({ parentName: null }, { name: 1, _id: 0 }).exec();
        return foundGroup;
    }
    static deleteManyGroupByName(groupName) {
        const deletedGroups = group_model_1.default.deleteMany({
            name: { $in: groupName },
        }).exec();
        return deletedGroups;
    }
    static getAllBranchHierarchyNames(branchName) {
        const allBranchGroups = (0, utils_1.getAllBranchHierarchyNames)(branchName);
        return allBranchGroups;
    }
    static getGroupByName(name) {
        const foundGroup = group_model_1.default.findOne({ name })
            // .populate({ path: 'usersId', model: 'User' })
            .exec();
        return foundGroup;
    }
    static async getAllGroupsByFilter(filter) {
        const foundGroups = await group_model_1.default.find(filter)
            .populate({ path: 'usersId', model: 'User' })
            .exec();
        return foundGroups;
    }
    static getManyGroupsByName(names) {
        const foundGroups = group_model_1.default.find({
            parentName: { $in: names },
        }).exec();
        return foundGroups;
    }
    static upsertGroupByName(name, groupData) {
        const upsertGroup = group_model_1.default.findOneAndUpdate({ name }, groupData, {
            upsert: true,
            new: true,
        }).exec();
        return upsertGroup;
    }
    static addGroupUpdateByName(name, groupData) {
        const updatedGroup = group_model_1.default.findOneAndUpdate({ name }, {
            name: groupData.name,
            parentName: groupData.parentName,
            manager: groupData.manager,
            $push: {
                usersId: groupData.usersId,
            },
        }, { upsert: true, new: true }).exec();
        return updatedGroup;
    }
    // Needed to add $in inside pull understand from almog why (all the array shit)
    static delGroupUpdateByName(name, groupData) {
        const updatedGroup = group_model_1.default.findOneAndUpdate({ name }, {
            name: groupData.name,
            parentName: groupData.parentName,
            manager: groupData.manager,
            $pull: {
                usersId: { $in: groupData.usersId },
            },
        }, { new: true }).exec();
        return updatedGroup;
    }
    static deletedGroupByName(name) {
        const deletedGroup = group_model_1.default.findOneAndDelete({ name }).exec();
        return deletedGroup;
    }
}
exports.default = GroupRepository;
