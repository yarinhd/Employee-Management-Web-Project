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

            throw new LackOfUserInfoError('User is missing fields - group it belong or userId ');
        }
        if (!Object.keys(teamsClassify).includes(usersTeamAndId[i].inGroup as string)) {
            teamsClassify[`${usersTeamAndId[i].inGroup}`] = [];
            teamsClassify[`${usersTeamAndId[i].inGroup}`].push(usersTeamAndId[i]._id as string);
            // eslint-disable-next-line no-continue
            continue;
        }
        teamsClassify[`${usersTeamAndId[i].inGroup}`].push(usersTeamAndId[i]._id as string);
    }
    return teamsClassify;
}

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
    if (!groupName) {
        return [];
    }

    const connectUserGroupManager = String(await GroupManager.getUserGroupManager(connectedUserId));

    const groupManagers = await getSuperiorGroupManagers(groupName);
    groupManagers.splice(groupManagers.indexOf(connectUserGroupManager) + 1);

    return groupManagers;
}

export async function isUserExist(UserFullName: string[] | string | null): Promise<boolean> {
    return (await UserModel.count({ username: UserFullName }).exec()) >= 1;
}

export async function isGroupExist(GroupFullName: string | null): Promise<boolean> {
    return (await GroupModel.count({ name: GroupFullName }).exec()) === 1;
}
