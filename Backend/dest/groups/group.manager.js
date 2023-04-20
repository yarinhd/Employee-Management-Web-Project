"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userError_1 = require("../utils/errors/userError");
const config_1 = require("../config");
const user_manager_1 = __importDefault(require("../users/user.manager"));
const utils_1 = require("../utils/utils");
const group_repository_1 = __importDefault(require("./group.repository"));
class GroupManager {
    /**
     * @param {string} groupName group name as PK
     * @return {IGroup} found group by groupName
     */
    static async getGroupByName(groupName) {
        const foundGroup = await group_repository_1.default.getGroupByName(groupName);
        if (!foundGroup) {
            throw new userError_1.GroupNotFoundError('Group not found');
        }
        return foundGroup;
    }
    /**
     * @param {string} groupName group name as PK
     * @return {IGroup} found group by groupName
     */
    static async getGroupByNamePopulated(groupName) {
        const foundGroup = await group_repository_1.default.getGroupByNamePopulated(groupName);
        if (!foundGroup) {
            throw new userError_1.GroupNotFoundError('Group not found');
        }
        return foundGroup;
    }
    /**
     * @param {string} userId group name as PK
     * @return {IGroup} found group by groupName
     */
    static async getUserGroupManager(userId) {
        const userGroupName = await (await user_manager_1.default.getUserByUserId(userId)).inGroup;
        if (!userGroupName) {
            return '';
        }
        const foundGroup = await group_repository_1.default.getGroupByName(userGroupName);
        if (!foundGroup) {
            throw new userError_1.GroupNotFoundError('Group not found');
        }
        return foundGroup.manager;
    }
    // return all groups that match the filter: parentName/ groupName
    /**
     * @param {IGroupFilter} filter group name/group parent as PK/FK
     * @return {IGroup} for groupName - the specific group
     *                  for paranetId - the sub groups (children group)
     *                  users return populated!
     */
    static async getAllGroupByFilter(filter) {
        const subGroups = await group_repository_1.default.getAllGroupsByFilter(filter);
        if (!subGroups) {
            throw new userError_1.GroupNotFoundError('Group not found');
        }
        return subGroups;
    }
    // return all groups that match the filter: parentName/ groupName
    /**
     * @param {IGroupFilter} filter group name/group parent as PK/FK
     * @return {IGroup} for groupName - the specific group
     *                  for paranetId - the sub groups (children group)
     *                  users return populated!
     */
    static async getAllExistBranches() {
        const existBranches = await group_repository_1.default.getAllExistBranches();
        console.log(existBranches);
        if (!existBranches) {
            return [];
        }
        const branches = existBranches.map((branch) => branch.name);
        return branches;
    }
    /**
     * @param {string[]} names array of group names as PK
     * @return {IGroup[]} populated array groups
     */
    static async getManyGroupsByName(names) {
        const foundGroups = await group_repository_1.default.getManyGroupsByName(names);
        if (!foundGroups) {
            throw new userError_1.GroupNotFoundError('Group not found');
        }
        return foundGroups;
    }
    /**
     * @param {string[]} branchName branch name
     * @return {IGroup[]} branch groups
     */
    static async getAllBranchHierarchyNames(branchName) {
        const branchGroups = await group_repository_1.default.getAllBranchHierarchyNames(branchName);
        if (!branchGroups) {
            return null;
        }
        return branchGroups;
    }
    /**
     * @param {string} userId user Id
     * @param {string} name group name
     * @param {string | null} parentName group parent name
     * @return {IGroup[]} created group (populated) based on group params data
     */
    static async upsertGroupFromPeopleApi(userId, name, parentName) {
        if (!userId) {
            throw new userError_1.UserNotFoundError('User not found - while creating the group');
        }
        const group = {
            name,
            usersId: [userId],
            parentName,
            // TODO: think about convert that name to objID
            manager: userId,
        };
        const addedGroup = await group_repository_1.default.upsertGroupByName(name, group);
        if (!addedGroup) {
            throw new userError_1.GroupNotFoundError('Group not found - failed to create group');
        }
        return addedGroup;
    }
    /**
     * @param {string} groupName group name PK
     * @param {Partial<IGroup>} groupData group data for update
     * @param {string} action delete or add data
     * @return {IGroup[]} updated group based on params data
     */
    static async updateGroupAndUsers(groupName, groupData) {
        if (await (0, utils_1.isGroupExist)(groupName)) {
            let updatedGroup = null;
            const usersId = groupData.usersId;
            updatedGroup = await group_repository_1.default.addGroupUpdateByName(groupName, groupData);
            if (!updatedGroup) {
                throw new userError_1.GroupNotFoundError('Group not found');
            }
            await user_manager_1.default.updateManyByUsersId(usersId, { inGroup: groupName });
            return updatedGroup;
        }
        throw new userError_1.DuplicatedUserError('Group failed to update - Cannot update group due to wrong inputs!');
        // if (action === config.action.Del) {
        //     updatedGroup = await GroupRepository.delGroupUpdateByName(groupName, groupData);
        //     if (!updatedGroup) {
        //         throw new GroupNotFoundError('Group not found');
        //     }
        //     // TODO: maybe not needed cause initalize group fields in user creation
        //     await UserManager.updateManyByUsersId(usersId, { inGroup: null } as Partial<IUser>);
        //     return updatedGroup;
        // }
    }
    /**
     * @param {string} groupName group name PK
     * @param {Partial<IGroup>} groupData group data for update
     * @param {string} action delete or add data
     * @return {IGroup[]} updated group based on params data
     */
    static async updateGroupByName(groupName, groupData, action) {
        const groupUsers = await GroupManager.getGroupByName(groupName);
        let updatedGroup = null;
        const users = groupUsers.usersId;
        if (await (0, utils_1.isGroupExist)(groupName)) {
            if (action === config_1.config.action.Add) {
                updatedGroup = await group_repository_1.default.addGroupUpdateByName(groupName, groupData);
                if (!updatedGroup) {
                    throw new userError_1.GroupNotFoundError('Group not found');
                }
                return updatedGroup;
            }
            if (action === config_1.config.action.Del) {
                updatedGroup = await group_repository_1.default.delGroupUpdateByName(groupName, groupData);
                if (!updatedGroup) {
                    throw new userError_1.GroupNotFoundError('Group not found');
                }
                await user_manager_1.default.updateManyByUsersId(users, { inGroup: null });
                return updatedGroup;
            }
        }
        throw new userError_1.GroupNotFoundError('Group not found');
    }
    /**
     * @param {string} groupName group name PK
     * @return {IGroup[]} deleted group based on group name
     */
    static async deletedGroupByName(GroupName) {
        const populatedGroup = await GroupManager.getGroupByName(GroupName);
        const deletedGroup = await this.recursiveGroupDelete(populatedGroup);
        if (!deletedGroup) {
            throw new userError_1.GroupNotFoundError('Group not found - failed to delete group');
        }
        return deletedGroup;
    }
    static async deletedManyGroupByName(GroupName) {
        const deletedGroup = await group_repository_1.default.deleteManyGroupByName(GroupName);
        if (!deletedGroup) {
            throw new userError_1.GroupNotFoundError('Group not found - failed to delete group');
        }
        console.log('deleted Groups:', deletedGroup);
        return deletedGroup;
    }
    /**
     * @param {IGroup} populatedGroup populated group
     * @return {IGroup} deleted group.
     * this function delete recursively the group and its users.
     */
    static async recursiveGroupDelete(populatedGroup) {
        const groupChildren = await GroupManager.getAllGroupByFilter({ parentName: populatedGroup.name });
        groupChildren.map(async (groupChild) => {
            const groupSubChildren = await GroupManager.getAllGroupByFilter({ parentName: groupChild.name });
            if (groupSubChildren.length) {
                await this.recursiveGroupDelete(groupChild);
            }
            // TODO: remember you ingore this line for now cause of changes
            // await UserManager.updateManyByUsername(groupChild.users as string[], { inGroup: null } as Partial<IUser>);
            await group_repository_1.default.deletedGroupByName(groupChild.name);
            // eslint-disable-next-line no-useless-return
            return;
        });
        // TODO: remember you ingore this line for now cause of changes
        // await UserManager.updateManyByUsername(populatedGroup.users as string[], { inGroup: null } as Partial<IUser>);
        return (await group_repository_1.default.deletedGroupByName(populatedGroup.name));
    }
}
exports.default = GroupManager;
