"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const group_manager_1 = __importDefault(require("../groups/group.manager"));
const userError_1 = require("../utils/errors/userError");
const user_repository_1 = __importDefault(require("./user.repository"));
const people_api_1 = require("../utils/people-api-mock/people-api");
const utils_1 = require("../utils/utils");
class UserManager {
    // static async updateBranch(branchName: string) {
    //     const updatedBranch = await UserRepository.updateBranch(branchName);
    //     if (!updatedBranch) {
    //         throw new BranchUpdateError('Faild to update Branch');
    //     }
    //     return updatedBranch;
    // }
    /**
     * @param {string} branchName branch name
     * @return {Object} of the classified teams and users.
     * this function create branch based on people-Api db. the branch include mador, team and users.
     * the creation is happening from root to leaf (branch -> mador -> team )
     */
    static async upsertBranch(branchName) {
        // check the type name of IPeople User (Based on people api package!)
        const createdBranchGroups = await group_manager_1.default.getAllBranchHierarchyNames(branchName);
        if (createdBranchGroups) {
            await group_manager_1.default.deletedManyGroupByName(createdBranchGroups);
        }
        let branchUsers = await people_api_1.users.getUsers(branchName, config_1.config.peopleApi.UserAndGroupfields);
        branchUsers = branchUsers.filter((user) => user.managerName !== null);
        const branchManager = branchUsers.find((user) => user.branchManager === user.username);
        if (!branchManager) {
            throw new userError_1.BranchManagerNotFoundError('Branch manager not found!');
        }
        const branchManagerUser = await UserManager.upsertUserPersonalAndGroupInfo(branchManager, branchManager.branch, '------');
        await group_manager_1.default.upsertGroupFromPeopleApi(branchManagerUser._id, branchManager.branch, null);
        const madorManagers = branchUsers.filter((user) => user.madorManager === user.username);
        if (!madorManagers) {
            // TODO: change to return cause it is not really Error
            return { msg: 'branch have been created. NOTE: there is no madors at the created branch.' };
        }
        const createdMadorManagers = await Promise.all(madorManagers.map((madorManagerUser) => {
            const createdUsers = UserManager.upsertUserPersonalAndGroupInfo(madorManagerUser, madorManagerUser.mador, madorManagerUser.mador);
            return createdUsers;
        }));
        await Promise.all(madorManagers.map((madorManagerUser) => {
            const managerUser = createdMadorManagers.find((user) => user.inGroup === madorManagerUser.mador);
            if (!managerUser) {
                throw new userError_1.UserNotFoundError(`User not found - no manager for this mador: ${madorManagerUser.mador}`);
            }
            const createdGroup = group_manager_1.default.upsertGroupFromPeopleApi(managerUser._id, madorManagerUser.mador, madorManagerUser.branch);
            return createdGroup;
        }));
        const teamManager = branchUsers.filter((user) => user.teamManager === user.username);
        if (!teamManager) {
            // TODO: change to return cause it is not really Error
            return { msg: 'branch have been created. NOTE: there is no teams at the created branch.' };
        }
        const createdTeamManagers = await Promise.all(teamManager.map(async (teamManagerUser) => {
            const createdUser = await UserManager.upsertUserPersonalAndGroupInfo(teamManagerUser, teamManagerUser.team, teamManagerUser.mador);
            return createdUser;
        }));
        await Promise.all(teamManager.map(async (teamManagerUser) => {
            const managerUser = createdTeamManagers.find((user) => user.inGroup === teamManagerUser.team);
            if (!managerUser) {
                throw new userError_1.UserNotFoundError(`User not found - no manager for this team: ${teamManagerUser.team}`);
            }
            const createdGroup = group_manager_1.default.upsertGroupFromPeopleApi(managerUser._id, teamManagerUser.team, teamManagerUser.mador);
            return createdGroup;
        }));
        const teamsUsers = branchUsers.filter((user) => user.branchManager !== user.username &&
            user.madorManager !== user.username &&
            user.teamManager !== user.username);
        if (!teamsUsers) {
            throw new userError_1.TeamUsersNotFoundError('There is no users at all inside teams!');
        }
        const createdTeamUsers = await Promise.all(teamsUsers.map((teamUsersGroup) => UserManager.upsertUserPersonalAndGroupInfo(teamUsersGroup, teamUsersGroup.team, teamUsersGroup.mador)));
        if (!createdTeamUsers) {
            throw new Error();
        }
        const teamsClassify = (0, utils_1.classifyUsersToGroups)(createdTeamUsers);
        const teamsNamesArr = Object.keys(teamsClassify);
        await Promise.all(teamsNamesArr.map((teamName) => group_manager_1.default.updateGroupByName(teamName, { usersId: teamsClassify[teamName] }, config_1.config.action.Add)));
        const upsertedBranchUsers = [branchManagerUser]
            .concat(createdMadorManagers)
            .concat(createdTeamManagers)
            .concat(createdTeamUsers);
        return upsertedBranchUsers;
    }
    /**
     * @param {string} userId user Id as Pk
     * @return {IUser} created User doc
     */
    static async getUserByUserId(userId) {
        const foundUser = await user_repository_1.default.getUserByUserId(userId);
        if (!foundUser) {
            throw new userError_1.UserNotFoundError('User not found');
        }
        return foundUser;
    }
    static async getMyPakoodimByUserId(loggedUser) {
        if (!loggedUser.inGroup) {
            return [];
            // throw new GroupNotFoundError('Group not found - group value is null');
        }
        const group = await group_manager_1.default.getGroupByName(loggedUser.inGroup);
        if (String(group.manager) !== String(loggedUser._id)) {
            return [loggedUser];
        }
        const groupHierarchyUsers = await this.getAllGroupHierarchyUsers(loggedUser.inGroup);
        return groupHierarchyUsers;
        // if (!foundUser) {
        //     throw new UserNotFoundError('User not found');
        // }
        // return foundUser;
    }
    static async getAllGroupHierarchyUsers(branchName) {
        const branchUsers = await user_repository_1.default.getAllGroupHierarchyUsers(branchName);
        if (!branchUsers) {
            throw new userError_1.UserNotFoundError('User not found');
        }
        return branchUsers;
    }
    /**
     * @param {string} groupName group name as PK
     * @return {IUser} group users by goup name docs
     */
    static async getGroupUsers(groupName) {
        await group_manager_1.default.getGroupByName(groupName);
        const groupUsers = await user_repository_1.default.getGroupUsers(groupName);
        if (!groupUsers) {
            throw new userError_1.UserNotFoundError('User Not Found');
        }
        return groupUsers;
    }
    /**
     * @param {string[]} usersId users Id array as PK
     * @return {IUser} array of users populated from array of users Ids
     */
    static async getManyByUsersId(usersId) {
        const foundUsers = await user_repository_1.default.getManyByUsersId(usersId);
        if (!foundUsers) {
            throw new userError_1.UserNotFoundError('User not found - failed while searching users');
        }
        return foundUsers;
    }
    // updating array of users in the same fields
    // for example updating all group users inGroup field
    /**
     * @param {string[]} usersId users Id array as PK
     * @return {IUser} updated users with the same field/s content
     * @example: updating all group users with inGroup field
     */
    static async updateManyByUsersId(usersId, userData) {
        const updatedUsers = await user_repository_1.default.updateManyByUsersId(usersId, userData);
        if (!updatedUsers) {
            throw new userError_1.UserNotFoundError('User not found - failed while updating file');
        }
        return updatedUsers;
    }
    /**
     * @param {IPeopleUser} user user details from people-Api
     * @return {IUser} upserted user with all details (*including* inGroup) based on user param
     * @example: if user already created user will be updated with the new fields content.
     */
    static async upsertUserPersonalAndGroupInfo(user, groupName, madorName) {
        console.log(user);
        const isBranchManager = user.branchManager === user.username;
        const { username, fullName, rank, job, serviceEndDate, gender, dateOfBirth } = user;
        const newUser = {
            username,
            fullName,
            rank,
            job,
            gender,
            dateOfBirth,
            serviceEndDate,
            inGroup: groupName,
            madorGroup: madorName,
            isAdmin: false,
            isBranchManager,
        };
        const addedUser = await user_repository_1.default.upsertUserByUsername(newUser.username, newUser);
        if (!addedUser) {
            throw new userError_1.UserNotFoundError("User failed to upsert - could'nt upsert the user");
        }
        return addedUser;
    }
    /**
     * @param {string} userName user Id as PK
     * @return {IUser} upserted user with all details (*excluding* inGroup and is Admin) based on user param
     * @example: if user already created user will be updated with the new fields content.
     */
    static async upsertUserPersonalInfo(userName, user) {
        const isBranchManager = user.branchManager === user.username;
        if (!user) {
            throw new userError_1.UserNotFoundError('User not found in People-API');
        }
        const newUser = isBranchManager
            ? {
                ...user,
                inGroup: user.branch,
                madorGroup: '------',
                isBranchManager,
            }
            : { ...user };
        const upsertedUser = await user_repository_1.default.upsertUserByUsername(userName, newUser);
        if (!upsertedUser) {
            throw new userError_1.UserNotFoundError("User failed to upsert - could'nt upsert user");
        }
        if (isBranchManager) {
            await group_manager_1.default.upsertGroupFromPeopleApi(upsertedUser._id, user.branch, null);
        }
        console.log(upsertedUser);
        return upsertedUser;
    }
    /**
     * @param {string} userId user Id as PK
     * @param {Partial <IUser>} userData user data content for update
     * @return {IUser} updated user with the userData fields content
     */
    static async updateUserByUserId(userId, userData) {
        const updatedUser = await user_repository_1.default.updateUserByUserId(userId, userData);
        if (!updatedUser) {
            throw new userError_1.UserNotFoundError("User failed to update - could'nt update the user");
        }
        return updatedUser;
    }
    /**
     * @param {string} userId user Id as PK
     * @return {IUser} deleted user
     */
    static async deletedUserByUserId(userId) {
        const userGroup = (await UserManager.getUserByUserId(userId)).inGroup;
        if (userGroup) {
            await group_manager_1.default.updateGroupByName(userGroup, { usersId: [userId] }, config_1.config.action.Del);
        }
        const deletedUser = await user_repository_1.default.deletedUserByUserId(userId);
        if (!deletedUser) {
            throw new userError_1.UserNotFoundError("User not found - can't delete user");
        }
        return deletedUser;
    }
    static async deleteManyUserByUserIds(userIds) {
        const deletedUsers = await user_repository_1.default.deleteManyUserByUserIds(userIds);
        if (!deletedUsers) {
            throw new userError_1.UserNotFoundError("User not found - can't delete user");
        }
        console.log('deleted users:', deletedUsers);
        return deletedUsers;
    }
}
exports.default = UserManager;
