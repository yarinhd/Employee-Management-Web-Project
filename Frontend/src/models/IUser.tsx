export default interface IUser {
    _id?: string;
    id?: string;
    username: string;
    fullName: string;
    rank: string;
    job: string;
    gender: string;
    serviceEndDate: string;
    inGroup: string | null;
    madorGroup: string | null;
    isAdmin: boolean;
    isBranchManager: boolean;
    avatar: string;
    createdAt?: string;
    updatedAt?: string;
}
