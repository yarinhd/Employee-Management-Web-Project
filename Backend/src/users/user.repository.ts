import { DeleteResult } from 'mongodb';
import { getAllGroupHierarchyUsers } from '../utils/utils';
import { IUser } from './user.interface';
import UserModel from './user.model';

export default class UserRepository {
    // static updateBranch(branchName: string) {
    //     const updatedBranch = updateBranch(branchName);
    //     return updatedBranch;
    // }

    static getAllGroupHierarchyUsers(branchName: string) {
        const branchUsers = getAllGroupHierarchyUsers(branchName);
        return branchUsers;
    }

    // static upsertBranch(branchName: string) {
    //     const upsertedBranch = upsertBranch(branchName);
    //     return upsertedBranch;
    // }

    static upsertUserByUsername(username: string, userData: Partial<IUser>) {
        const upsertedUser: Promise<IUser | null> = UserModel.findOneAndUpdate({ username }, userData, {
            upsert: true,
            new: true,
        }).exec();
        return upsertedUser;
    }

    static getUserByUserId(userId: string): Promise<IUser | null> {
        const foundUser: Promise<IUser | null> = UserModel.findOne({ _id: userId }).exec();
        return foundUser;
    }

    static getGroupUsers(inGroup: string) {
        const groupUsers: Promise<IUser[] | null> = UserModel.find({ inGroup }).exec();
        return groupUsers;
    }

    static getManyByUsersId(usersId: string[]) {
        const foundUsers: Promise<IUser[] | null> = UserModel.find({
            _id: { $in: usersId },
        }).exec();
        return foundUsers;
    }

    static async updateManyByUsersId(usersId: string[], userData: Partial<IUser>) {
        const updatedUsers = await UserModel.updateMany({}, userData).exec();
        console.log(updatedUsers);

        return updatedUsers;
    }

    // static createUser(newUser: IUser): Promise<IUser> {
    //     const addedUser: Promise<IUser> = UserModel.create(newUser);
    //     return addedUser;
    // }

    static updateUserByUserId(userId: string, userData: Partial<IUser>): Promise<IUser | null> {
        const updatedUser: Promise<IUser | null> = UserModel.findOneAndUpdate({ _id: userId }, userData, {
            new: true,
        }).exec();
        return updatedUser;
    }

    static deletedUserByUserId(userId: string): Promise<IUser | null> {
        const deletedUser: Promise<IUser | null> = UserModel.findOneAndDelete({ _id: userId }).exec();
        return deletedUser;
    }

    static deleteManyUserByUserIds(userIds: string[]) {
        const foundUsers: Promise<DeleteResult | null> = UserModel.deleteMany({
            _id: { $in: userIds },
        }).exec();
        return foundUsers;
    }
}
