import IUser from './IUser';

export default interface GlobalState {
    isLoading: boolean;
    user: IUser | null;
    pakoodim: IUser[];
    chosenUser: IUser | null;
    selectedIndex: number;
    error: string; // HTTP ERROR CODE
    isDarkMode: boolean;
}
