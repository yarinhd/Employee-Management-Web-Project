import { DeleteResult } from 'mongodb';
import { config } from '../config';
import GroupManager from '../groups/group.manager';
import { BranchManagerNotFoundError, TeamUsersNotFoundError, UserNotFoundError } from '../utils/errors/userError';
import { IUser } from './user.interface';
import UserRepository from './user.repository';
import { IPeopleUser } from '../utils/people-api-mock/people_user.interface';
import { IGroup } from '../groups/group.interface';
import { users } from '../utils/people-api-mock/people-api';
import { classifyUsersToGroups } from '../utils/utils';

export default class UserManager {
    /**
     * @param {string} branchName branch name
     * @return {Object} of the classified teams and users.
     * this function create branch based on people-Api db. the branch include mador, team and users.
     * the creation is happening from root to leaf (branch -> mador -> team )
     */
    static async upsertBranch(branchName: string) {
        // check the type name of IPeople User (Based on people api package!)
        const createdBranchGroups: string[] | null = await GroupManager.getAllBranchHierarchyNames(branchName);
        if (createdBranchGroups) {
            await GroupManager.deletedManyGroupByName(createdBranchGroups);
        }
        let branchUsers: IPeopleUser[] = await users.getUsers(branchName, config.peopleApi.UserAndGroupfields);
        branchUsers = branchUsers.filter((user) => user.managerName !== null);
        const branchManager: IPeopleUser | undefined = branchUsers.find((user) => user.branchManager === user.username);
        if (!branchManager) {
            throw new BranchManagerNotFoundError('Branch manager not found!');
        }
        const branchManagerUser = await UserManager.upsertUserPersonalAndGroupInfo(
            branchManager,
            branchManager.branch,
            '------'
        );
        await GroupManager.upsertGroupFromPeopleApi(branchManagerUser._id as string, branchManager.branch, null);
        const madorManagers: IPeopleUser[] | undefined = branchUsers.filter(
            (user) => user.madorManager === user.username
        );
        if (!madorManagers) {
            return { msg: 'branch have been created. NOTE: there is no madors at the created branch.' };
        }
        const createdMadorManagers: IUser[] = await Promise.all(
            madorManagers.map((madorManagerUser) => {
                const createdUsers: Promise<IUser> = UserManager.upsertUserPersonalAndGroupInfo(
                    madorManagerUser,
                    madorManagerUser.mador,
                    madorManagerUser.mador
                );
                return createdUsers;
            })
        );
        await Promise.all(
            madorManagers.map((madorManagerUser) => {
                const managerUser: IUser | undefined = createdMadorManagers.find(
                    (user) => user.inGroup === madorManagerUser.mador
                );
                if (!managerUser) {
                    throw new UserNotFoundError(
                        `User not found - no manager for this mador: ${madorManagerUser.mador}`
                    );
                }
                const createdGroup: Promise<IGroup> = GroupManager.upsertGroupFromPeopleApi(
                    managerUser._id as string,
                    madorManagerUser.mador,
                    madorManagerUser.branch
                );
                return createdGroup;
            })
        );
        const teamManager: IPeopleUser[] | undefined = branchUsers.filter((user) => user.teamManager === user.username);
        if (!teamManager) {
            return { msg: 'branch have been created. NOTE: there is no teams at the created branch.' };
        }
        const createdTeamManagers: IUser[] = await Promise.all(
            teamManager.map(async (teamManagerUser) => {
                const createdUser: IUser = await UserManager.upsertUserPersonalAndGroupInfo(
                    teamManagerUser,
                    teamManagerUser.team,
                    teamManagerUser.mador
                );
                return createdUser;
            })
        );
        await Promise.all(
            teamManager.map(async (teamManagerUser) => {
                const managerUser: IUser | undefined = createdTeamManagers.find(
                    (user) => user.inGroup === teamManagerUser.team
                );
                if (!managerUser) {
                    throw new UserNotFoundError(`User not found - no manager for this team: ${teamManagerUser.team}`);
                }
                const createdGroup = GroupManager.upsertGroupFromPeopleApi(
                    managerUser._id as string,
                    teamManagerUser.team,
                    teamManagerUser.mador
                );
                return createdGroup;
            })
        );
        const teamsUsers: IPeopleUser[] | undefined = branchUsers.filter(
            (user) =>
                user.branchManager !== user.username &&
                user.madorManager !== user.username &&
                user.teamManager !== user.username
        );
        if (!teamsUsers) {
            throw new TeamUsersNotFoundError('There is no users at all inside teams!');
        }
        const createdTeamUsers: IUser[] | null = await Promise.all(
            teamsUsers.map((teamUsersGroup) =>
                UserManager.upsertUserPersonalAndGroupInfo(teamUsersGroup, teamUsersGroup.team, teamUsersGroup.mador)
            )
        );
        if (!createdTeamUsers) {
            throw new Error();
        }
        const teamsClassify: { [key: string]: string[] } = classifyUsersToGroups(createdTeamUsers);

        const teamsNamesArr = Object.keys(teamsClassify);
        await Promise.all(
            teamsNamesArr.map((teamName) =>
                GroupManager.updateGroupByName(teamName, { usersId: teamsClassify[teamName] }, config.action.Add)
            )
        );
        const upsertedBranchUsers: IUser[] = [branchManagerUser]
            .concat(createdMadorManagers)
            .concat(createdTeamManagers)
            .concat(createdTeamUsers);

        return upsertedBranchUsers;
    }

    /**
     * @param {string} userId user Id as Pk
     * @return {IUser} created User doc
     */
    static async getUserByUserId(userId: string) {
        const foundUser = await UserRepository.getUserByUserId(userId);
        if (!foundUser) {
            throw new UserNotFoundError('User not found');
        }
        return foundUser;
    }

    static async getMyPakoodimByUserId(loggedUser: IUser) {
        if (!loggedUser.inGroup) {
            return [];
            // throw new GroupNotFoundError('Group not found - group value is null');
        }
        const group: IGroup = await GroupManager.getGroupByName(loggedUser.inGroup);

        if (String(group.manager) !== String(loggedUser._id)) {
            return [loggedUser];
        }
        const groupHierarchyUsers: IUser[] = await this.getAllGroupHierarchyUsers(loggedUser.inGroup);
        return groupHierarchyUsers;
    }

    static async getAllGroupHierarchyUsers(branchName: string) {
        const branchUsers = await UserRepository.getAllGroupHierarchyUsers(branchName);
        if (!branchUsers) {
            throw new UserNotFoundError('User not found');
        }
        return branchUsers;
    }

    /**
     * @param {string} groupName group name as PK
     * @return {IUser} group users by goup name docs
     */
    static async getGroupUsers(groupName: string) {
        await GroupManager.getGroupByName(groupName);
        const groupUsers: IUser[] | null = await UserRepository.getGroupUsers(groupName);
        if (!groupUsers) {
            throw new UserNotFoundError('User Not Found');
        }
        return groupUsers;
    }

    /**
     * @param {string[]} usersId users Id array as PK
     * @return {IUser} array of users populated from array of users Ids
     */
    static async getManyByUsersId(usersId: string[]) {
        const foundUsers = await UserRepository.getManyByUsersId(usersId);
        if (!foundUsers) {
            throw new UserNotFoundError('User not found - failed while searching users');
        }
        return foundUsers;
    }

    /**
     * @param {string[]} usersId users Id array as PK
     *  updating array of users in the same fields
     *  for example updating all group users inGroup field
     * @return {IUser} updated users with the same field/s content
     * @example: updating all group users with inGroup field
     */
    static async updateManyByUsersId(usersId: string[], userData: Partial<IUser>) {
        const updatedUsers = await UserRepository.updateManyByUsersId(usersId, userData);
        if (!updatedUsers) {
            throw new UserNotFoundError('User not found - failed while updating file');
        }
        return updatedUsers;
    }

    /**
     * @param {IPeopleUser} user user details from people-Api
     * @return {IUser} upserted user with all details (*including* inGroup) based on user param
     * @example: if user already created user will be updated with the new fields content.
     */
    static async upsertUserPersonalAndGroupInfo(user: IPeopleUser, groupName: string, madorName: string | null) {
        const isBranchManager = user.branchManager === user.username;

        const { username, fullName, rank, job, serviceEndDate, gender, dateOfBirth } = user;
        const newUser: IUser = {
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
        const addedUser = await UserRepository.upsertUserByUsername(newUser.username, newUser);
        if (!addedUser) {
            throw new UserNotFoundError("User failed to upsert - could'nt upsert the user");
        }
        return addedUser;
    }

    /**
     * @param {string} userName user Id as PK
     * @return {IUser} upserted user with all details (*excluding* inGroup and is Admin) based on user param
     * @example: if user already created user will be updated with the new fields content.
     */
    static async upsertUserPersonalInfo(userName: string, user: IPeopleUser) {
        const isBranchManager = user.branchManager === user.username;
        if (!user) {
            throw new UserNotFoundError('User not found in People-API');
        }

        const newUser: Partial<IUser> = isBranchManager
            ? {
                  ...user,
                  inGroup: user.branch,
                  madorGroup: '------',
                  isBranchManager,
              }
            : { ...user };

        const upsertedUser = await UserRepository.upsertUserByUsername(userName, newUser);
        if (!upsertedUser) {
            throw new UserNotFoundError("User failed to upsert - could'nt upsert user");
        }
        if (isBranchManager) {
            await GroupManager.upsertGroupFromPeopleApi(upsertedUser._id as string, user.branch, null);
        }

        return upsertedUser;
    }

    /**
     * @param {string} userId user Id as PK
     * @param {Partial <IUser>} userData user data content for update
     * @return {IUser} updated user with the userData fields content
     */
    static async updateUserByUserId(userId: string, userData: Partial<IUser>) {
        const updatedUser = await UserRepository.updateUserByUserId(userId, userData);
        if (!updatedUser) {
            throw new UserNotFoundError("User failed to update - could'nt update the user");
        }
        return updatedUser;
    }

    /**
     * @param {string} userId user Id as PK
     * @return {IUser} deleted user
     */
    static async deletedUserByUserId(userId: string) {
        const userGroup: string | null = ((await UserManager.getUserByUserId(userId)) as IUser).inGroup;
        if (userGroup) {
            await GroupManager.updateGroupByName(userGroup, { usersId: [userId] }, config.action.Del);
        }
        const deletedUser = await UserRepository.deletedUserByUserId(userId);
        if (!deletedUser) {
            throw new UserNotFoundError("User not found - can't delete user");
        }
        return deletedUser;
    }

    static async deleteManyUserByUserIds(userIds: string[]) {
        const deletedUsers: DeleteResult | null = await UserRepository.deleteManyUserByUserIds(userIds);
        if (!deletedUsers) {
            throw new UserNotFoundError("User not found - can't delete user");
        }

        return deletedUsers;
    }
}
