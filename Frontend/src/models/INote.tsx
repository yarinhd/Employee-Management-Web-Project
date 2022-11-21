import IUser from './IUser';

export default interface INote {
    _id?: string;
    title: string;
    subtitle: string;
    hidden: boolean;
    description: string;
    userId: string | IUser | undefined;
    createdBy: string | IUser | undefined;
    createdAt?: string;
    updatedAt?: string;
}
