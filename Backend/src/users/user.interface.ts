export interface IUser {
    _id?: string;
    username: string;
    fullName: string;
    rank: string;
    job: string;
    gender: string;
    dateOfBirth: string;
    serviceEndDate: string;
    inGroup: string | null;
    madorGroup: string | null;
    isAdmin: boolean;
    isBranchManager: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserTeamId {
    userId: string;
    team: string;
}
