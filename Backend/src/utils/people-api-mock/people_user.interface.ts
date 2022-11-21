export interface IPeopleUser {
    _id?: string;
    username: string;
    fullName: string;
    rank: string;
    job: string;
    gender: string;
    dateOfBirth: string;
    serviceEndDate: string;
    team: string;
    teamManager: string;
    managerName: string | null;
    mador: string;
    madorManager: string;
    branch: string;
    branchManager: string;
}
