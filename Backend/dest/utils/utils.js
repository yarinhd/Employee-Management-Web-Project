"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGroupExist = exports.isUserExist = exports.filterRelevantUsers = exports.getAllBranchHierarchyNames = exports.getAllGroupHierarchyUsers = exports.classifyUsersToGroups = void 0;
const group_manager_1 = __importDefault(require("../groups/group.manager"));
const group_model_1 = __importDefault(require("../groups/group.model"));
const user_manager_1 = __importDefault(require("../users/user.manager"));
const user_model_1 = __importDefault(require("../users/user.model"));
const userError_1 = require("./errors/userError");
const validationUtils_1 = require("./validations/validationUtils");
/**
 * @param {IUser[]} usersTeamAndId array of mixed team users
 * @return {Object} object with classified key which each one represent team name
 *  and the value is array of usersId related to the team.
 */
function classifyUsersToGroups(usersTeamAndId) {
    const teamsClassify = {};
    for (let i = 0; i < usersTeamAndId.length; i++) {
        if (!usersTeamAndId[i].inGroup || !usersTeamAndId[i]._id) {
            console.log('error', usersTeamAndId[i].inGroup, usersTeamAndId[i]._id);
            console.log(usersTeamAndId[i]);
            throw new userError_1.LackOfUserInfoError('User is missing fields - group it belong or userId ');
        }
        if (!Object.keys(teamsClassify).includes(usersTeamAndId[i].inGroup)) {
            teamsClassify[`${usersTeamAndId[i].inGroup}`] = [];
            teamsClassify[`${usersTeamAndId[i].inGroup}`].push(usersTeamAndId[i]._id);
            // TODO: ask almog if that is ok
            // eslint-disable-next-line no-continue
            continue;
        }
        teamsClassify[`${usersTeamAndId[i].inGroup}`].push(usersTeamAndId[i]._id);
    }
    return teamsClassify;
}
exports.classifyUsersToGroups = classifyUsersToGroups;
async function getAllGroupHierarchyUsers(branchName) {
    const branchUsers = [];
    const branchGroup = await group_manager_1.default.getGroupByNamePopulated(branchName);
    branchUsers.push(branchGroup.usersId);
    const madorGroups = await group_manager_1.default.getAllGroupByFilter({ parentName: branchName });
    const madorUsers = madorGroups.map((group) => group.usersId).flat();
    const teamGroups = (await Promise.all(madorGroups.map((mador) => group_manager_1.default.getAllGroupByFilter({ parentName: mador.name })))).flat();
    const teamUsers = teamGroups.map((group) => group.usersId).flat();
    branchUsers.push(madorUsers, teamUsers);
    return branchUsers.flat();
}
exports.getAllGroupHierarchyUsers = getAllGroupHierarchyUsers;
async function getAllBranchHierarchyNames(branchName) {
    const fullGroupHierarchy = [];
    fullGroupHierarchy.push([branchName]);
    const madorGroups = await group_manager_1.default.getAllGroupByFilter({ parentName: branchName });
    fullGroupHierarchy.push(madorGroups.map((mador) => mador.name));
    const allTeamGroups = await Promise.all(madorGroups.map((mador) => group_manager_1.default.getAllGroupByFilter({ parentName: mador.name })));
    fullGroupHierarchy.push(allTeamGroups.flat().map((group) => group.name));
    return fullGroupHierarchy.flat();
}
exports.getAllBranchHierarchyNames = getAllBranchHierarchyNames;
async function filterRelevantUsers(userId, connectedUserId) {
    const groupName = (await user_manager_1.default.getUserByUserId(userId)).inGroup;
    if (!groupName) {
        return [];
    }
    const connectUserGroupManager = String(await group_manager_1.default.getUserGroupManager(connectedUserId));
    const groupManagers = await (0, validationUtils_1.getSuperiorGroupManagers)(groupName);
    groupManagers.splice(groupManagers.indexOf(connectUserGroupManager) + 1);
    return groupManagers;
}
exports.filterRelevantUsers = filterRelevantUsers;
async function isUserExist(UserFullName) {
    return (await user_model_1.default.count({ username: UserFullName }).exec()) >= 1;
}
exports.isUserExist = isUserExist;
async function isGroupExist(GroupFullName) {
    return (await group_model_1.default.count({ name: GroupFullName }).exec()) === 1;
}
exports.isGroupExist = isGroupExist;
