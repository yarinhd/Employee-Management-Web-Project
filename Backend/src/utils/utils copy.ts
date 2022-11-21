import { IGroup } from '../groups/group.interface';
import GroupManager from '../groups/group.manager';
import GroupModel from '../groups/group.model';
import { IUser } from '../users/user.interface';
import UserManager from '../users/user.manager';
import UserModel from '../users/user.model';
import { LackOfUserInfoError } from './errors/userError';
import { getSuperiorGroupManagers } from './validations/validationUtils';

/**
 * @param {IUser[]} usersTeamAndId array of mixed team users
 * @return {Object} object with classified key which each one represent team name
 *  and the value is array of usersId related to the team.
 */
export function classifyUsersToGroups(usersTeamAndId: IUser[]) {
    const teamsClassify: { [key: string]: string[] } = {};
    for (let i = 0; i < usersTeamAndId.length; i++) {
        if (!usersTeamAndId[i].inGroup || !usersTeamAndId[i]._id) {
            console.log('error', usersTeamAndId[i].inGroup, usersTeamAndId[i]._id);
            console.log(usersTeamAndId[i]);

            throw new LackOfUserInfoError('User is missing fields - group it belong or userId ');
        }
        if (!Object.keys(teamsClassify).includes(usersTeamAndId[i].inGroup as string)) {
            teamsClassify[`${usersTeamAndId[i].inGroup}`] = [];
            teamsClassify[`${usersTeamAndId[i].inGroup}`].push(usersTeamAndId[i]._id as string);
            // TODO: ask almog if that is ok
            // eslint-disable-next-line no-continue
            continue;
        }
        teamsClassify[`${usersTeamAndId[i].inGroup}`].push(usersTeamAndId[i]._id as string);
    }
    return teamsClassify;
}

/**
 * @param {string[]} originalGroup array A contain many Users
 * @param {string[]} newGroup array B contain many Users
 * @return {Object} the items that belong to A but not to B (A-B).
 * @example For [1,2,3] [2,3] it will yield [1]. On the other hand, for [1,2,3] [2,3,5] will return the same thing.
 */
// export async function userIdsToRemove(originalGroup: IUser[], newGroup: IPeopleUser[]): Promise<string[] | null> {
//     const originalGroupUsernames: string[] = originalGroup.map((user) => user.username as string);
//     const newGroupUsernames: string[] = newGroup.map((user) => user.username as string);
//     const usernames: string[] = originalGroupUsernames.filter((username) => !newGroupUsernames.includes(username));
//     console.log(usernames);

//     if (!usernames.length) return null;
//     const extraGroupUsers: string[] = usernames.map((username) => {
//         const foundUser = originalGroup.find((user) => user.username === username);
//         return foundUser?.username;
//     }) as string[];
//     const extraGroupUsersPopulated: IPeopleUser[] = await Promise.all(
//         extraGroupUsers.map((user) => users.getUser(user, config.peopleApi.UserAndGroupfields))
//     );
//     const releasedUsers: string[] = extraGroupUsersPopulated
//         .filter((user) => user.managerName === null)
//         .map((user) => user.username);
//     const releasedUsersIds: string[] = originalGroup
//         .filter((user) => releasedUsers.includes(user.username))
//         .map((user) => user._id!);
//     return releasedUsersIds;
// }

/**
 * @param {string} branchName branch name
 * @return {Object} of the classified teams and users.
 * this function create branch based on people-Api db. the branch include mador, team and users.
 * the creation is happening from root to leaf (branch -> mador -> team )
 */
// export async function upsertBranch(branchName: string) {
//     console.log('branch', branchName);

//     // check the type name of IPeople User (Based on people api package!)
//     const createdBranchGroups: string[] | null = await GroupManager.getAllBranchHierarchyNames(branchName);
//     if (createdBranchGroups) {
//         await GroupManager.deletedManyGroupByName(createdBranchGroups);
//     }
//     let branchUsers: IPeopleUser[] = await users.getUsers(branchName, config.peopleApi.UserAndGroupfields);
//     branchUsers = branchUsers.filter((user) => user.managerName !== null);
//     const branchManager: IPeopleUser | undefined = branchUsers.find((user) => user.branchManager === user.username);
//     if (!branchManager) {
//         throw new BranchManagerNotFoundError('Branch manager not found!');
//     }
//     const branchManagerUser = await UserManager.upsertUserPersonalAndGroupInfo(
//         branchManager,
//         branchManager.branch,
//         '------'
//     );
//     await GroupManager.upsertGroupFromPeopleApi(branchManagerUser._id as string, branchManager.branch, null);

//     const madorManagers: IPeopleUser[] | undefined = branchUsers.filter((user) => user.madorManager === user.username);
//     if (!madorManagers) {
//         // TODO: change to return cause it is not really Error
//         return { msg: 'branch have been created. NOTE: there is no madors at the created branch.' };
//     }

//     const createdMadorManagers: IUser[] = await Promise.all(
//         madorManagers.map((madorManagerUser) => {
//             const createdUsers: Promise<IUser> = UserManager.upsertUserPersonalAndGroupInfo(
//                 madorManagerUser,
//                 madorManagerUser.mador,
//                 madorManagerUser.mador
//             );
//             return createdUsers;
//         })
//     );

//     await Promise.all(
//         madorManagers.map((madorManagerUser) => {
//             const managerUser: IUser | undefined = createdMadorManagers.find(
//                 (user) => user.inGroup === madorManagerUser.mador
//             );
//             if (!managerUser) {
//                 throw new UserNotFoundError(`User not found - no manager for this mador: ${madorManagerUser.mador}`);
//             }
//             const createdGroup: Promise<IGroup> = GroupManager.upsertGroupFromPeopleApi(
//                 managerUser._id as string,
//                 madorManagerUser.mador,
//                 madorManagerUser.branch
//             );
//             return createdGroup;
//         })
//     );

//     const teamManager: IPeopleUser[] | undefined = branchUsers.filter((user) => user.teamManager === user.username);
//     if (!teamManager) {
//         // TODO: change to return cause it is not really Error
//         return { msg: 'branch have been created. NOTE: there is no teams at the created branch.' };
//     }

//     const createdTeamManagers: IUser[] = await Promise.all(
//         teamManager.map(async (teamManagerUser) => {
//             const createdUser: IUser = await UserManager.upsertUserPersonalAndGroupInfo(
//                 teamManagerUser,
//                 teamManagerUser.team,
//                 teamManagerUser.mador
//             );
//             return createdUser;
//         })
//     );

//     await Promise.all(
//         teamManager.map(async (teamManagerUser) => {
//             const managerUser: IUser | undefined = createdTeamManagers.find(
//                 (user) => user.inGroup === teamManagerUser.team
//             );
//             if (!managerUser) {
//                 throw new UserNotFoundError(`User not found - no manager for this team: ${teamManagerUser.team}`);
//             }
//             const createdGroup = GroupManager.upsertGroupFromPeopleApi(
//                 managerUser._id as string,
//                 teamManagerUser.team,
//                 teamManagerUser.mador
//             );
//             return createdGroup;
//         })
//     );

//     const teamsUsers: IPeopleUser[] | undefined = branchUsers.filter(
//         (user) =>
//             user.branchManager !== user.username &&
//             user.madorManager !== user.username &&
//             user.teamManager !== user.username
//     );
//     if (!teamsUsers) {
//         throw new TeamUsersNotFoundError('There is no users at all inside teams!');
//     }
//     const createdTeamUsers: IUser[] | null = await Promise.all(
//         teamsUsers.map((teamUsersGroup) =>
//             UserManager.upsertUserPersonalAndGroupInfo(teamUsersGroup, teamUsersGroup.team, teamUsersGroup.mador)
//         )
//     );
//     if (!createdTeamUsers) {
//         throw new Error();
//     }

//     const teamsClassify: { [key: string]: string[] } = classifyUsersToGroups(createdTeamUsers);

//     const teamsNamesArr = Object.keys(teamsClassify);
//     await Promise.all(
//         teamsNamesArr.map((teamName) =>
//             GroupManager.updateGroupByName(teamName, { usersId: teamsClassify[teamName] }, config.action.Add)
//         )
//     );

//     const allUsers: IUser[] = [branchManagerUser]
//         .concat(createdMadorManagers)
//         .concat(createdTeamManagers)
//         .concat(createdTeamUsers);
//     return allUsers;
// }

/**
 * @param {string} BranchName branch name for update operation
 * @param {string} originalBranchName branch name for comparing the existing branch
 * @return {Object} of the classified teams and users.
 * this function create branch based on people-Api db. the branch include mador, team and users.
 * the creation is happening from root to leaf (branch -> mador -> team )
 */

// export async function updateBranch(BranchName: string) {
//     // check the type name of IPeople User (Based on people api package!)
//     let newBranchUsers: IPeopleUser[] = await users.getUsers(BranchName, config.peopleApi.UserAndGroupfields);
//     // const releasedUsers: IPeopleUser[] | string[] = newBranchUsers.filter((user) => user.managerName === null);
//     newBranchUsers = newBranchUsers.filter((user) => user.managerName !== null);

//     const branchManager: IPeopleUser | undefined = newBranchUsers.find((user) => user.branchManager === user.username);
//     if (!branchManager) {
//         throw new BranchManagerNotFoundError('Branch manager not found!');
//     }

//     const originalBranchUsers: IUser[] = await UserManager.getAllGroupHierarchyUsers(BranchName);
//     const oldHierarchyNames: string[] | null = await GroupManager.getAllBranchHierarchyNames(BranchName);
//     if (oldHierarchyNames) {
//         await GroupManager.deletedManyGroupByName(oldHierarchyNames);
//     }

//     const usersToRemove: string[] | null = await userIdsToRemove(originalBranchUsers, newBranchUsers);
//     console.log('users to remove:', usersToRemove);
//     // problem is delete many by userIds but it is usernames that return from usersToremove
//     if (usersToRemove) {
//         await UserManager.deleteManyUserByUserIds(usersToRemove);
//     }
//     const branchManagerUser = await UserManager.upsertUserPersonalAndGroupInfo(
//         branchManager,
//         branchManager.branch,
//         branchManager.mador
//     );
//     await GroupManager.upsertGroupFromPeopleApi(branchManagerUser._id as string, branchManager.branch, null);

//     const madorManagers: IPeopleUser[] | undefined = newBranchUsers.filter(
//         (user) => user.madorManager === user.username
//     );
//     if (!madorManagers) {
//         // TODO: change to return cause it is not really Error
//         return { msg: 'branch have been created. NOTE: there is no madors at the created branch.' };
//     }

//     const createdMadorManagers: IUser[] = await Promise.all(
//         madorManagers.map((madorManagerUser) => {
//             const createdUsers: Promise<IUser> = UserManager.upsertUserPersonalAndGroupInfo(
//                 madorManagerUser,
//                 madorManagerUser.mador,
//                 madorManagerUser.mador
//             );
//             return createdUsers;
//         })
//     );

//     await Promise.all(
//         madorManagers.map((madorManagerUser) => {
//             const managerUser: IUser | undefined = createdMadorManagers.find(
//                 (user) => user.inGroup === madorManagerUser.mador
//             );
//             if (!managerUser) {
//                 throw new UserNotFoundError(`User not found - no manager for this mador: ${madorManagerUser.mador}`);
//             }
//             const createdGroup: Promise<IGroup> = GroupManager.upsertGroupFromPeopleApi(
//                 managerUser._id as string,
//                 madorManagerUser.mador,
//                 madorManagerUser.branch
//             );
//             return createdGroup;
//         })
//     );

//     const teamManager: IPeopleUser[] | undefined = newBranchUsers.filter((user) => user.teamManager === user.username);
//     if (!teamManager) {
//         // TODO: change to return cause it is not really Error
//         return { msg: 'branch have been created. NOTE: there is no teams at the created branch.' };
//     }

//     const createdTeamManagers: IUser[] = await Promise.all(
//         teamManager.map(async (teamManagerUser) => {
//             const createdUser: IUser = await UserManager.upsertUserPersonalAndGroupInfo(
//                 teamManagerUser,
//                 teamManagerUser.team,
//                 teamManagerUser.mador
//             );
//             return createdUser;
//         })
//     );

//     await Promise.all(
//         teamManager.map(async (teamManagerUser) => {
//             const managerUser: IUser | undefined = createdTeamManagers.find(
//                 (user) => user.inGroup === teamManagerUser.team
//             );
//             if (!managerUser) {
//                 throw new UserNotFoundError(`User not found - no manager for this team: ${teamManagerUser.team}`);
//             }
//             const createdGroup = GroupManager.upsertGroupFromPeopleApi(
//                 managerUser._id as string,
//                 teamManagerUser.team,
//                 teamManagerUser.mador
//             );
//             return createdGroup;
//         })
//     );

//     const teamsUsers: IPeopleUser[] | undefined = newBranchUsers.filter(
//         (user) =>
//             user.branchManager !== user.username &&
//             user.madorManager !== user.username &&
//             user.teamManager !== user.username
//     );
//     if (!teamsUsers) {
//         throw new TeamUsersNotFoundError('There is no users at all inside teams!');
//     }
//     const createdTeamUsers: IUser[] | null = await Promise.all(
//         teamsUsers.map((teamUsersGroup) =>
//             UserManager.upsertUserPersonalAndGroupInfo(teamUsersGroup, teamUsersGroup.team, teamUsersGroup.mador)
//         )
//     );
//     if (!createdTeamUsers) {
//         throw new Error();
//     }

//     const teamsClassify: { [key: string]: string[] } = classifyUsersToGroups(createdTeamUsers);
//     const teamsNamesArr = Object.keys(teamsClassify);
//     await Promise.all(
//         teamsNamesArr.map((teamManagerUser) =>
//             GroupManager.updateGroupByName(
//                 teamManagerUser,
//                 { usersId: teamsClassify[teamManagerUser] },
//                 config.action.Add
//             )
//         )
//     );
//     return teamsClassify;
// }

// export async function isUserInGroupNull(username: string[] | undefined): Promise<boolean> {
//     if (username !== undefined && username.length) {
//         const populatedUsers: IUser[] = await UserManager.getManyByUsername(username);
//         if (populatedUsers.length !== username.length) {
//             throw new UserNotFoundError('User/s not found');
//         }
//         const usersWithNullGroup: number = populatedUsers.filter((user: IUser) => user.inGroup === null).length;
//         console.log('null inGroup fields: ', usersWithNullGroup);
//         if (username.length === usersWithNullGroup) return true;
//         return false;
//     }
//     return true;
// }

/**
 * @param {IGroup} populatedGroup populated group
 * @return {IGroup} deleted group.
 * this function delete recursively the group and its users.
 */
// export async function recursiveGroupDelete(populatedGroup: IGroup) {
//     const groupChildren: IGroup[] = await GroupManager.getAllGroupByFilter({ parentName: populatedGroup.name });
//     groupChildren.map(async (groupChild) => {
//         const groupSubChildren: IGroup[] = await GroupManager.getAllGroupByFilter({ parentName: groupChild.name });
//         if (groupSubChildren.length) {
//             await recursiveGroupDelete(groupChild);
//         }
//         // TODO: remember you ingore this line for now cause of changes
//         // await UserManager.updateManyByUsername(groupChild.users as string[], { inGroup: null } as Partial<IUser>);
//         await GroupRepository.deletedGroupByName(groupChild.name);
//         // eslint-disable-next-line no-useless-return
//         return;
//     });
//     // TODO: remember you ingore this line for now cause of changes
//     // await UserManager.updateManyByUsername(populatedGroup.users as string[], { inGroup: null } as Partial<IUser>);
//     return (await GroupRepository.deletedGroupByName(populatedGroup.name)) as IGroup;
// }

// export async function getAllGroupHierarchyUsers(branchName: string) {
//     const branchUsers: IUser[][] = [];
//     const branchGroup: IGroup = await GroupManager.getGroupByNamePopulated(branchName);
//     branchUsers.push(branchGroup.usersId as IUser[]);
//     const madorGroups: IGroup[] = await GroupManager.getAllGroupByFilter({ parentName: branchName });
//     const madorUsers: IUser[] = madorGroups.map((group) => group.usersId as IUser[]).flat();
//     const teamGroups: IGroup[] = (
//         await Promise.all(madorGroups.map((mador) => GroupManager.getAllGroupByFilter({ parentName: mador.name })))
//     ).flat();
//     const teamUsers: IUser[] = teamGroups.map((group) => group.usersId as IUser[]).flat();
//     branchUsers.push(madorUsers, teamUsers);
//     return branchUsers.flat();
// }

export async function getAllBranchHierarchyNames(branchName: string): Promise<string[]> {
    const fullGroupHierarchy: string[][] = [];
    fullGroupHierarchy.push([branchName]);
    const madorGroups: IGroup[] = await GroupManager.getAllGroupByFilter({ parentName: branchName });
    fullGroupHierarchy.push(madorGroups.map((mador) => mador.name));
    const allTeamGroups: IGroup[][] = await Promise.all(
        madorGroups.map((mador) => GroupManager.getAllGroupByFilter({ parentName: mador.name }))
    );
    fullGroupHierarchy.push(allTeamGroups.flat().map((group) => group.name));

    return fullGroupHierarchy.flat();
}

export async function filterRelevantUsers(userId: string, connectedUserId: string): Promise<string[]> {
    const groupName: string | null = (await UserManager.getUserByUserId(userId)).inGroup;
    console.log('groupName', groupName);
    if (!groupName) {
        return [];
    }

    const connectUserGroupManager = String(await GroupManager.getUserGroupManager(connectedUserId));
    console.log('connedted user group manager:', connectUserGroupManager);

    const groupManagers = await getSuperiorGroupManagers(groupName);
    console.log('beforeSplice:', groupManagers);
    groupManagers.splice(groupManagers.indexOf(connectUserGroupManager) + 1);
    console.log('afterSplice:', groupManagers);

    return groupManagers;
}

export async function isUserExist(UserFullName: string[] | string | null): Promise<boolean> {
    return (await UserModel.count({ username: UserFullName }).exec()) >= 1;
}

export async function isGroupExist(GroupFullName: string | null): Promise<boolean> {
    return (await GroupModel.count({ name: GroupFullName }).exec()) === 1;
}

// export async function getGroupAdmin(groupname: string): Promise<string[]> {
//     let populatedGroup: IGroup = await GroupManager.getGroupByName(groupname);
//     const admins: string[] = [populatedGroup.manager as string];
//     while (populatedGroup.parentName !== null) {
//         // eslint-disable-next-line no-await-in-loop
//         populatedGroup = (await GroupManager.getGroupByName(populatedGroup.parentName as string)) as IGroup;
//         admins.push(populatedGroup.manager as string);
//     }
//     return admins;
