import { IUser } from '../users/user.interface';

export interface IGroup {
    _id?: string;
    name: string;
    usersId: string[] | IUser[];
    parentName: string | null;
    manager: string | IUser;
    createdAt?: string;
    updatedAt?: string;
}

export interface IGroupFilter {
    groupName?: string;
    parentName?: string;
}
