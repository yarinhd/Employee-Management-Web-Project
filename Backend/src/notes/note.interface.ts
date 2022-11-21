import { IUser } from '../users/user.interface';

export default interface INote {
    _id?: string;
    title: string;
    subtitle: string;
    hidden: boolean;
    description: string;
    userId: string | IUser;
    createdBy: string | IUser;
    createdAt?: string;
    updatedAt?: string;
}
