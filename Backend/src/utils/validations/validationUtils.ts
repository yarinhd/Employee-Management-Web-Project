import { IGroup } from '../../groups/group.interface';
import GroupManager from '../../groups/group.manager';
import { IUser } from '../../users/user.interface';
import UserManager from '../../users/user.manager';
import { GroupNotFoundError, MissingParamsError, UnAuthorizedError, UserWithoutGroupError } from '../errors/userError';

/**
 * @param {string} groupname http request
 * @return {Promise<string[]>} array with admin users Id
 * the function works recursively and making an array of users admins based on group name hierarchy
 * @example if goupname is team so the array will include [teamManagerId, madorManagerId, branchManagerId]
 */
export async function getGroupManagers(groupname: string): Promise<string[]> {
    const populatedGroup: IGroup = await GroupManager.getGroupByName(groupname);
    const admins: string[] = [];
    admins.push(String(populatedGroup.manager as string));
    if (!populatedGroup.parentName) {
        return admins;
    }
    const fatherGroup: IGroup | null = await GroupManager.getGroupByName(populatedGroup.parentName);
    if (!fatherGroup) {
        throw new GroupNotFoundError('Group not found - failed while creating admins list');
    }
    const superiorAdmin = await getGroupManagers(fatherGroup.name);
    return admins.concat(superiorAdmin);
}

/**
 * @param {string} groupname http request
 * @return {Promise<string[]>} array with admin users Id
 * the function works recursively and making an array of users admins based on group name hierarchy
 * @example if goupname is team so the array will include [teamManagerId, madorManagerId, branchManagerId]
 */
export async function getSuperiorGroupManagers(groupname: string): Promise<string[]> {
    const populatedGroup: IGroup = await GroupManager.getGroupByName(groupname);
    const admins: string[] = [];
    admins.push(String(populatedGroup.manager as string));
    if (!populatedGroup.parentName) {
        return admins;
    }
    const fatherGroup: IGroup | null = await GroupManager.getGroupByName(populatedGroup.parentName);
    if (!fatherGroup) {
        throw new GroupNotFoundError('Group not found - failed while creating admins list');
    }
    const superiorAdmin = await getGroupManagers(fatherGroup.name);
    return admins.concat(superiorAdmin);
}

/**
 * @param {string} groupname http request
 * @return {Promise<string[]>} array with admin users Id
 * the function works recursively and making an array of users admins based on group name hierarchy
 * @example if goupname is team so the array will include [teamManagerId, madorManagerId, branchManagerId]
 */
// export async function getSubGroupManagers(groupname: string): Promise<string[]> {
//     const populatedGroup: IGroup = await GroupManager.getGroupByName(groupname);
//     const admins: string[] = [];
//     // TODO: go for son groups ingroup with this group name
//     admins.push(String(populatedGroup.manager as string));
//     const childrenGroups: IGroup[] = await GroupManager.getAllGroupByFilter({ parentName: groupname });
//     if (!childrenGroups.length) {
//         return admins;
//     }
//     // const fatherGroup: IGroup | null = await GroupManager.getGroupByName(populatedGroup.parentName);
//     // if (!fatherGroup) {
//     //     throw new GroupNotFoundError('Group not found - failed while creating admins list');
//     // }
//     const groupManagers: string[][] = await Promise.all(
//         childrenGroups.map((group) => {
//             const subGroupManagers: Promise<string[]> = getSubGroupManagers(group.name);
//             return subGroupManagers;
//         })
//     );
//     return admins.concat(groupManagers.flat());
// }

/**
 * @param {IUser} loggedUser connected user with valid token (populated token)
 * @param {string | null} userId user Id
 * @return {null} equivalet to true
 * the function check if the logged user is manager in his group hierarchy - if its true will return null
 * group is extract from userId - for getting the users admins at the hierarchy.
 */
export async function isManagerAndNotSelfUser(loggedUser: IUser, userId: string | null) {
    if (loggedUser.isAdmin) {
        return;
    }
    if (userId) {
        if (userId === String(loggedUser._id as string)) {
            throw new UnAuthorizedError('User is not authorized!');
        }
        const user: IUser = await UserManager.getUserByUserId(userId);
        const userGroupName = user.inGroup;
        if (!userGroupName) {
            throw new UserWithoutGroupError('user dont have group!');
        }
        const groupAdmins = await getGroupManagers(userGroupName);
        if (groupAdmins.includes(String(loggedUser._id as string))) {
            return;
        }
        throw new UnAuthorizedError('User is not authorized!');
    }
    throw new MissingParamsError('Missing params - need to send userId');
}

/**
 * @param {IUser} loggedUser connected user with valid token (populated token)
 * @param {string | null} userId user Id
 * @return {null} equivalet to true
 * the function check if the logged user is manager in his group hierarchy - if its true will return null
 * group is extract from userId - for getting the users admins at the hierarchy.
 */
export async function isCreatedByLoggedUser(loggedUser: IUser, noteCreatorUserId: string | null) {
    if (loggedUser.isAdmin) {
        return;
    }
    if (noteCreatorUserId) {
        if (String(noteCreatorUserId) === String(loggedUser._id)) {
            return;
        }
        throw new UnAuthorizedError('User is not authorized!');
    }
    throw new MissingParamsError('Missing params - need to send userId');
}

/**
 * @param {IUser} loggedUser connected user with valid token (populated token)
 * @param {string | null} groupName group name
 * @return {null} equivalet to true
 * the function check if the logged user is manager in his group hierarchy - if its true will return null
 */
export async function isManagerByGroupName(loggedUser: IUser, groupName: string | null) {
    if (loggedUser.isAdmin) {
        return;
    }
    if (groupName) {
        const groupAdmins: string[] = await getGroupManagers(groupName);
        if (groupAdmins.includes(String(loggedUser._id as string))) {
            return;
        }
        throw new UnAuthorizedError('User is not authorized!');
    }
    throw new MissingParamsError('Missing params - no groupName field');
}

/**
 * @param {IUser} loggedUser connected user with valid token (populated token)
 * @param {string | null} userId user Id
 * @return {null} equivalet to true
 * the function check if the logged user is manager in his group hierarchy or belong to the logged user
 * if its true will return null
 */
export async function isManagerOrUserByUserId(loggedUser: IUser, userId: string | null) {
    let groupAdmins: string[] = [];
    if (loggedUser.isAdmin) {
        return;
    }

    if (userId) {
        if (String(userId) === String(loggedUser._id)) {
            return;
        }
        const noteGroupName: string | null = ((await UserManager.getUserByUserId(userId)) as IUser).inGroup;
        if (!noteGroupName) {
            throw new UserWithoutGroupError("note creator user don't has group!");
        }
        groupAdmins = await getGroupManagers(noteGroupName);
        if (groupAdmins.includes(String(loggedUser._id as string))) {
            return;
        }
        throw new UnAuthorizedError('User is not authorized!');
    }
    throw new MissingParamsError('Missing params - no note userId field');
}
