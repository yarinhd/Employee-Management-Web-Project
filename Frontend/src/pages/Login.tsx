import { makeStyles } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useWrapFetch from '../hooks/useWrapFetch';
import { setMyUserCookie } from '../services/user';
import { Context } from '../store/Store';
import toastHandler from '../Utils/toastHandler';

// component for registering user at first login to the system

const useStyles = makeStyles(() => ({
    box: {
        display: 'flex',
        padding: '0 0px',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 25,
        letterSpacing: 0,
        color: '#3E3E3E',
        marginBottom: 24,
    },
}));

const Login: React.FC = () => {
    console.log('LOGIN - startlogin');

    const navigate = useNavigate();
    const [state, dispatch] = useContext(Context);
    console.log(`Login - ${state.error}`);

    const classes = useStyles();
    const setMyUserCookieWrapped = useWrapFetch(setMyUserCookie);
    useEffect(() => {
        setMyUserCookieWrapped()((userAuth) => {
            console.log('hi effect');
            dispatch({ type: 'SET_CHOSEN_USER', payload: userAuth.user });
            dispatch({ type: 'SET_USER', payload: userAuth.user });
            // dispatch({ type: 'SET_TOAST_MSG', payload: { show: true, class: 'success', content: 'התחבר בהצלחה' } });
        });
    }, []);

    // const setMyUserCookieWrapped = useWrapFetch(setMyUserCookie)();
    // useEffect(() => {
    //     setMyUserCookieWrapped((user) => {
    //         console.log('hi effect');
    //         dispatch({ type: 'SET_USER', payload: user });
    //     });
    // }, []);

    return (
        <>
            {state.user && <Navigate to="/notes" />}
            {/* {state.error && alertMsg.show && <ToastMsg type={alertMsg.class} content={alertMsg.content} />} */}
            {/* {state.error && <Navigate to="/error/" />} */}
        </>
    );
};

export default Login;
