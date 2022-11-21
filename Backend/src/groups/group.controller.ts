import { Request, Response } from 'express';
// import { IUser } from '../users/user.interface';
import { WrongFilterInputError } from '../utils/errors/userError';
import { IGroup, IGroupFilter } from './group.interface';
import GroupManager from './group.manager';

export default class GroupController {
    static async getGroupByName(req: Request, res: Response) {
        const { groupName } = req.params;
        const groupFound = await GroupManager.getGroupByName(groupName);
        res.status(200).json(groupFound);
    }

    static async getAllGroupByFilter(req: Request, res: Response) {
        const { groupName, parentName } = req.query as IGroupFilter;
        if ((groupName && parentName) || (!groupName && !parentName)) {
            throw new WrongFilterInputError('More than one filter sent or filter name not valid');
        }
        const filter: IGroupFilter = { groupName, parentName };
        const subGroups = await GroupManager.getAllGroupByFilter(filter);
        res.json(subGroups);
    }

    static async getAllExistBranches(req: Request, res: Response) {
        const allBranches: string[] = await GroupManager.getAllExistBranches();
        res.json(allBranches);
    }

    static async updateGroupByName(req: Request, res: Response) {
        const groupName = req.query.groupName as string;
        const action = req.query.action as string;
        const groupData = req.body as Partial<IGroup>;
        // not sure -need to check
        const updatedGroup = await GroupManager.updateGroupByName(groupName, groupData, action);
        res.status(200).json(updatedGroup);
    }

    static async deleteGroupByName(req: Request, res: Response) {
        const { groupName } = req.params;
        const deletedGroup = await GroupManager.deletedGroupByName(groupName);
        res.status(200).json(deletedGroup);
    }
}
