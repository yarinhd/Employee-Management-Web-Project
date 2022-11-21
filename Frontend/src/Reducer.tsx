import GlobalState from './models/GlobalState';
import IUser from './models/IUser';
import toastHandler from './Utils/toastHandler';

export type ACTIONTYPE =
    | { type: 'SET_USER'; payload: IUser }
    | { type: 'SET_PAKOODIM'; payload: IUser[] }
    | { type: 'SET_CHOSEN_USER'; payload: IUser | null }
    | { type: 'SET_SELECTED_INDEX'; payload: number }
    | { type: 'LOADING' }
    | { type: 'UNLOADING' }
    | { type: 'SET_ERROR'; payload?: string }
    | { type: 'UNSET_ERROR' }
    | { type: 'SET_DARKMODE' }
    | { type: 'UNSET_DARKMODE' };

const Reducer: (state: GlobalState, action: ACTIONTYPE) => GlobalState = (state: GlobalState, action: ACTIONTYPE) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
            };
        case 'SET_PAKOODIM':
            return {
                ...state,
                pakoodim: action.payload,
            };
        case 'SET_CHOSEN_USER':
            return {
                ...state,
                chosenUser: action.payload,
            };
        case 'SET_SELECTED_INDEX':
            return {
                ...state,
                selectedIndex: action.payload,
            };
        case 'LOADING':
            return {
                ...state,
                isLoading: true,
            };
        case 'UNLOADING':
            return {
                ...state,
                isLoading: false,
            };
        case 'SET_ERROR':
            toastHandler('error', 'ישנה תקלה במערכת! נא להתחבר שנית במועד מאוחר יותר.');

            return {
                ...state,
                error: action.payload || '500',
            };
        case 'UNSET_ERROR':
            return {
                ...state,
                error: '',
            };
        case 'SET_DARKMODE':
            return {
                ...state,
                isDarkMode: true,
            };
        case 'UNSET_DARKMODE':
            return {
                ...state,
                isDarkMode: false,
            };
        default:
            return state;
    }
};

export default Reducer;
