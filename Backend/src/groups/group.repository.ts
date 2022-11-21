import { DeleteResult } from 'mongodb';
import { getAllBranchHierarchyNames } from '../utils/utils';
import { IGroup, IGroupFilter } from './group.interface';
import GroupModel from './group.model';

export default class GroupRepository {
    static getGroupByNamePopulated(name: string) {
        const foundGroup: Promise<IGroup | null> = GroupModel.findOne({ name })
            .populate({ path: 'usersId', model: 'User' })
            .exec();
        return foundGroup;
    }

    static getAllExistBranches() {
        const foundGroup: Promise<{ name: string }[] | null> = GroupModel.find(
            { parentName: null },
            { name: 1, _id: 0 }
        ).exec();
        return foundGroup;
    }

    static deleteManyGroupByName(groupName: string[]): Promise<DeleteResult | null> {
        const deletedGroups: Promise<DeleteResult | null> = GroupModel.deleteMany({
            name: { $in: groupName },
        }).exec();
        return deletedGroups;
    }

    static getAllBranchHierarchyNames(branchName: string) {
        const allBranchGroups = getAllBranchHierarchyNames(branchName);
        return allBranchGroups;
    }

    static getGroupByName(name: string): Promise<IGroup | null> {
        const foundGroup: Promise<IGroup | null> = GroupModel.findOne({ name })
            // .populate({ path: 'usersId', model: 'User' })
            .exec();
        return foundGroup;
    }

    static async getAllGroupsByFilter(filter: IGroupFilter) {
        const foundGroups: IGroup[] | null = await GroupModel.find(filter)
            .populate({ path: 'usersId', model: 'User' })
            .exec();
        return foundGroups;
    }

    static getManyGroupsByName(names: string[]) {
        const foundGroups: Promise<IGroup[] | null> = GroupModel.find({
            parentName: { $in: names },
        }).exec();
        return foundGroups;
    }

    static upsertGroupByName(name: string, groupData: Partial<IGroup>): Promise<IGroup | null> {
        const upsertGroup: Promise<IGroup | null> = GroupModel.findOneAndUpdate({ name }, groupData, {
            upsert: true,
            new: true,
        }).exec();
        return upsertGroup;
    }

    static addGroupUpdateByName(name: string, groupData: Partial<IGroup>): Promise<IGroup | null> {
        const updatedGroup: Promise<IGroup | null> = GroupModel.findOneAndUpdate(
            { name },
            {
                name: groupData.name,
                parentName: groupData.parentName,
                manager: groupData.manager,
                $push: {
                    usersId: groupData.usersId,
                },
            },
            { upsert: true, new: true }
        ).exec();
        return updatedGroup;
    }

    // Needed to add $in inside pull understand from almog why (all the array shit)
    static delGroupUpdateByName(name: string, groupData: Partial<IGroup>): Promise<IGroup | null> {
        const updatedGroup: Promise<IGroup | null> = GroupModel.findOneAndUpdate(
            { name },
            {
                name: groupData.name,
                parentName: groupData.parentName,
                manager: groupData.manager,
                $pull: {
                    usersId: { $in: groupData.usersId },
                },
            },
            { new: true }
        ).exec();

        return updatedGroup;
    }

    static deletedGroupByName(name: string): Promise<IGroup | null> {
        const deletedGroup: Promise<IGroup | null> = GroupModel.findOneAndDelete({ name }).exec();
        return deletedGroup;
    }
}
