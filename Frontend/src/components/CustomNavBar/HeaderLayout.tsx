import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


import Autocomplete from '@mui/material/Autocomplete';
import { Avatar, Grid, makeStyles, Paper, TextField } from '@material-ui/core';
import { Box } from '@mui/material';
import IUser from '../../models/IUser';
import { Context } from '../../store/Store';
import { getUser, getMyPakoodim } from '../../services/user';
import useWrapFetch from '../../hooks/useWrapFetch';
import BranchManagerComp from '../BranchManagerComp.tsx/BranchManagerComp';
import toastHandler from '../../Utils/toastHandler';

const styles = {
    root: { backgound: 'black' },
    input: { color: 'white' },
};

const useStyles = makeStyles(() => ({
    topLayout: {
        background: 'linear-gradient(225deg, #5680E9 30%, #84CEEB 80%, #C1C8E4 100% )',
    },
    rightSide: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: '2%',
    },
    leftSide: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    center: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

const HeaderLayout: React.FC<React.HTMLAttributes<any>> = () => {
    const [state, dispatch] = React.useContext(Context);

    const getUserWrapped = useWrapFetch(getUser);
    const getMyPakoodimWrapped = useWrapFetch(getMyPakoodim);

    React.useEffect(() => {
        if (state.user !== null) {
            getMyPakoodimWrapped(state.user?.inGroup)((pakoodim) => {
                dispatch({ type: 'SET_PAKOODIM', payload: pakoodim });
            });
            dispatch({ type: 'SET_CHOSEN_USER', payload: state.user });
        }
    }, [state.user]);

    const handleAutoCompClick = (event: React.SyntheticEvent<Element, Event>, value: IUser | null): void => {
        const userVal: IUser = value || state.user!;
        const filteredUser: IUser | undefined = state.pakoodim.find((user) => user._id === userVal._id);
        if (!filteredUser) {
            dispatch({ type: 'SET_ERROR' });
            return;
        }

        dispatch({ type: 'SET_CHOSEN_USER', payload: filteredUser });
        toastHandler('info', `הינך כעת בעמוד של: ${filteredUser.fullName} `);
    };
    const classes = useStyles();

    return (
        <AppBar className={classes.topLayout}>
            <Toolbar>

                <Grid container>
                    <Grid item xs={3} className={classes.rightSide}>
                        <Typography className={classes.rightSide} variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            <Avatar
                                alt="Remy Sharp"
                                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            />
                            שלום {state.user?.fullName}
                        </Typography>
                    </Grid>

                    <Grid item xs={6} className={classes.center}>
                        {state.user && (
                            <Autocomplete
                                value={state.chosenUser || state.user}
                                autoHighlight
                                disablePortal
                                onChange={handleAutoCompClick}
                                defaultValue={state.user as IUser}
                                id="combo-box-demo"
                                options={state.pakoodim as IUser[]}
                                groupBy={(option) => option.inGroup as string}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                getOptionLabel={(option) => option.fullName}
                                sx={{
                                    width: '50%',
                                    color: 'white',
                                    boxShadow:
                                        'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
                                    '& input': {
                                        color: 'white',
                                    },
                                    '& label': {
                                        color: 'white',
                                    },
                                }}
                                renderOption={(props, option) => (
                                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                        <img
                                            loading="lazy"
                                            width="20"
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8xlBwhEawy9A19aM4M15TPYs5rM5xGEHmBA&usqp=CAU"
                                            alt=""
                                        />
                                        {option.fullName}
                                    </Box>
                                )}
                                renderInput={(params) => <TextField variant="outlined" {...params} label="בחר עובד" />}
                                blurOnSelect="mouse"
                            />
                        )}
                    </Grid>
                    <Grid item xs={3} className={classes.leftSide}>
                        {state.user?.isBranchManager && <BranchManagerComp />}
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderLayout;
