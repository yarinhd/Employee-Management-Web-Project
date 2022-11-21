import { Request, Response } from 'express';
import UserManager from './user.manager';
import { IUser } from './user.interface';

export default class UserController {
    // static async updateBranch(req: Request, res: Response) {
    //     const { branchName } = req.params;
    //     const updatedBranch = await UserManager.updateBranch(branchName);
    //     res.json(updatedBranch);
    // }

    static async upsertBranch(req: Request, res: Response) {
        const { branchName } = req.params;
        const upsertedBranch = await UserManager.upsertBranch(branchName);
        res.json(upsertedBranch);
    }

    static async getGroupUsers(req: Request, res: Response) {
        const { groupName } = req.params;
        const groupUsers: IUser[] = await UserManager.getGroupUsers(groupName);
        res.json(groupUsers);
    }

    static async getUserByUserId(req: Request, res: Response) {
        console.log('aaa');

        const { userId } = req.params;
        const searchResult = await UserManager.getUserByUserId(userId);
        console.log(searchResult);

        res.status(200).json(searchResult);
    }

    static async getMyUser(req: Request, res: Response) {
        res.status(200).json(req.user);
    }

    static async getMyPakoodim(req: Request, res: Response) {
        const loggedUser = req.user! as IUser;
        const pakoodim: IUser[] = await UserManager.getMyPakoodimByUserId(loggedUser);
        console.log(pakoodim);

        res.status(200).json(pakoodim);
    }

    static async updateUserByUserId(req: Request, res: Response) {
        const userId = req.params.userId as string;
        const userData = req.body as Partial<IUser>;
        const updatedUser = await UserManager.updateUserByUserId(userId, userData);
        res.status(200).json(updatedUser);
    }

    static async deleteUserByUserId(req: Request, res: Response) {
        const userId = req.params.userId as string;
        const deletedUser = await UserManager.deletedUserByUserId(userId);
        res.status(200).json(deletedUser);
    }
}
