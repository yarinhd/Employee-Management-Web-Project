import { DeleteResult } from 'mongodb';
import {
    DuplicatedUserError as WrongUserInputError,
    GroupNotFoundError,
    UserNotFoundError,
} from '../utils/errors/userError';
import { config } from '../config';
import { IUser } from '../users/user.interface';
import UserManager from '../users/user.manager';

import { isGroupExist } from '../utils/utils';
import { IGroup, IGroupFilter } from './group.interface';
import GroupRepository from './group.repository';

export default class GroupManager {
    /**
     * @param {string} groupName group name as PK
     * @return {IGroup} found group by groupName
     */
    static async getGroupByName(groupName: string) {
        const foundGroup = await GroupRepository.getGroupByName(groupName);
        if (!foundGroup) {
            throw new GroupNotFoundError('Group not found');
        }
        return foundGroup;
    }

    /**
     * @param {string} groupName group name as PK
     * @return {IGroup} found group by groupName
     */
    static async getGroupByNamePopulated(groupName: string) {
        const foundGroup = await GroupRepository.getGroupByNamePopulated(groupName);
        if (!foundGroup) {
            throw new GroupNotFoundError('Group not found');
        }
        return foundGroup;
    }

    /**
     * @param {string} userId group name as PK
     * @return {IGroup} found group by groupName
     */
    static async getUserGroupManager(userId: string) {
        const userGroupName = await (await UserManager.getUserByUserId(userId)).inGroup;
        if (!userGroupName) {
            return '';
        }
        const foundGroup = await GroupRepository.getGroupByName(userGroupName);
        if (!foundGroup) {
            throw new GroupNotFoundError('Group not found');
        }
        return foundGroup.manager as string;
    }

    // return all groups that match the filter: parentName/ groupName
    /**
     * @param {IGroupFilter} filter group name/group parent as PK/FK
     * @return {IGroup} for groupName - the specific group
     *                  for paranetId - the sub groups (children group)
     *                  users return populated!
     */
    static async getAllGroupByFilter(filter: IGroupFilter) {
        const subGroups: IGroup[] | null = await GroupRepository.getAllGroupsByFilter(filter);
        if (!subGroups) {
            throw new GroupNotFoundError('Group not found');
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
        const existBranches: { name: string }[] | null = await GroupRepository.getAllExistBranches();
        console.log(existBranches);

        if (!existBranches) {
            return [];
        }
        const branches: string[] = existBranches.map((branch) => branch.name);
        return branches;
    }

    /**
     * @param {string[]} names array of group names as PK
     * @return {IGroup[]} populated array groups
     */
    static async getManyGroupsByName(names: string[]) {
        const foundGroups: IGroup[] | null = await GroupRepository.getManyGroupsByName(names);
        if (!foundGroups) {
            throw new GroupNotFoundError('Group not found');
        }
        return foundGroups;
    }

    /**
     * @param {string[]} branchName branch name
     * @return {IGroup[]} branch groups
     */
    static async getAllBranchHierarchyNames(branchName: string) {
        const branchGroups: string[] | null = await GroupRepository.getAllBranchHierarchyNames(branchName);
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
    static async upsertGroupFromPeopleApi(userId: string, name: string, parentName: string | null) {
        if (!userId) {
            throw new UserNotFoundError('User not found - while creating the group');
        }
        const group: IGroup = {
            name,
            usersId: [userId],
            parentName,
            // TODO: think about convert that name to objID
            manager: userId,
        };
        const addedGroup = await GroupRepository.upsertGroupByName(name, group);
        if (!addedGroup) {
            throw new GroupNotFoundError('Group not found - failed to create group');
        }
        return addedGroup;
    }

    /**
     * @param {string} groupName group name PK
     * @param {Partial<IGroup>} groupData group data for update
     * @param {string} action delete or add data
     * @return {IGroup[]} updated group based on params data
     */
    static async updateGroupAndUsers(groupName: string, groupData: Partial<IGroup>) {
        if (await isGroupExist(groupName)) {
            let updatedGroup: IGroup | null = null;
            const usersId = groupData.usersId as string[];

            updatedGroup = await GroupRepository.addGroupUpdateByName(groupName, groupData);

            if (!updatedGroup) {
                throw new GroupNotFoundError('Group not found');
            }
            await UserManager.updateManyByUsersId(usersId, { inGroup: groupName } as Partial<IUser>);
            return updatedGroup;
        }
        throw new WrongUserInputError('Group failed to update - Cannot update group due to wrong inputs!');

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
    static async updateGroupByName(groupName: string, groupData: Partial<IGroup>, action: string) {
        const groupUsers = await GroupManager.getGroupByName(groupName);
        let updatedGroup: IGroup | null = null;
        const users = groupUsers.usersId as string[];
        if (await isGroupExist(groupName)) {
            if (action === config.action.Add) {
                updatedGroup = await GroupRepository.addGroupUpdateByName(groupName, groupData);

                if (!updatedGroup) {
                    throw new GroupNotFoundError('Group not found');
                }
                return updatedGroup;
            }
            if (action === config.action.Del) {
                updatedGroup = await GroupRepository.delGroupUpdateByName(groupName, groupData);
                if (!updatedGroup) {
                    throw new GroupNotFoundError('Group not found');
                }
                await UserManager.updateManyByUsersId(users, { inGroup: null } as Partial<IUser>);
                return updatedGroup;
            }
        }

        throw new GroupNotFoundError('Group not found');
    }

    /**
     * @param {string} groupName group name PK
     * @return {IGroup[]} deleted group based on group name
     */
    static async deletedGroupByName(GroupName: string) {
        const populatedGroup: IGroup = await GroupManager.getGroupByName(GroupName);
        const deletedGroup = await this.recursiveGroupDelete(populatedGroup);
        if (!deletedGroup) {
            throw new GroupNotFoundError('Group not found - failed to delete group');
        }
        return deletedGroup;
    }

    static async deletedManyGroupByName(GroupName: string[]) {
        const deletedGroup: DeleteResult | null = await GroupRepository.deleteManyGroupByName(GroupName);
        if (!deletedGroup) {
            throw new GroupNotFoundError('Group not found - failed to delete group');
        }
        console.log('deleted Groups:', deletedGroup);

        return deletedGroup;
    }

    /**
     * @param {IGroup} populatedGroup populated group
     * @return {IGroup} deleted group.
     * this function delete recursively the group and its users.
     */
    static async recursiveGroupDelete(populatedGroup: IGroup) {
        const groupChildren: IGroup[] = await GroupManager.getAllGroupByFilter({ parentName: populatedGroup.name });
        groupChildren.map(async (groupChild) => {
            const groupSubChildren: IGroup[] = await GroupManager.getAllGroupByFilter({ parentName: groupChild.name });
            if (groupSubChildren.length) {
                await this.recursiveGroupDelete(groupChild);
            }
            // TODO: remember you ingore this line for now cause of changes
            // await UserManager.updateManyByUsername(groupChild.users as string[], { inGroup: null } as Partial<IUser>);
            await GroupRepository.deletedGroupByName(groupChild.name);
            // eslint-disable-next-line no-useless-return
            return;
        });
        // TODO: remember you ingore this line for now cause of changes
        // await UserManager.updateManyByUsername(populatedGroup.users as string[], { inGroup: null } as Partial<IUser>);
        return (await GroupRepository.deletedGroupByName(populatedGroup.name)) as IGroup;
    }
}
