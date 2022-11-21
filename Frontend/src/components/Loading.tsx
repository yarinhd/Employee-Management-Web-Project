import { makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { HashLoader } from 'react-spinners';
import { Context } from '../store/Store';

// component for registering user at first login to the system

const useStyles = makeStyles(() => ({
    loader: {
        display: 'block',
        margin: '0 auto',
    },
    center: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '10px',
    },
}));

const Loading: React.FC = () => {
    const [state] = useContext(Context);
    const classes = useStyles();
    return (
        <div className={classes.center}>
            <HashLoader css={classes.loader} loading={state.isLoading} />
        </div>
    );
};

export default Loading;
