import { makeStyles, Paper } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer, toast } from 'react-toastify';
import { Context } from '../store/Store';
// component for registering user at first login to the system

const useStyles = makeStyles(() => ({
    box: {
        display: 'flex',
        padding: '0 96px',
        flexDirection: 'column',
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

const ErrorComp: React.FC = () => {
    const [state, dispatch] = useContext(Context);
    const notify = () =>
        toast.error('ההתחברות נכשלה! אנא בצע כניסה מחודשת . ', {
            position: 'top-center',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });



    const classes = useStyles();

    return <br />;
};

export default ErrorComp;

