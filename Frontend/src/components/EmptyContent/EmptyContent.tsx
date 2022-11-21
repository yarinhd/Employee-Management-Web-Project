import { makeStyles } from '@material-ui/core';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import { Box, Typography } from '@mui/material';
import React, { useContext } from 'react';
import IUser from '../../models/IUser';
import { Context } from '../../store/Store';
import FlipCardList from '../PersonalInfo/FlipCardList';

const useStyle = makeStyles({
    iconWrapper: {
        flexDirection: 'row',
        height: '100%',
        margin: '0px',
        border: '1px solid',
        borderRadius: '10px',
        width: '100%',
        // height: '100%',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    noteWrapper: {
        position: 'relative',
        top: '25vh',
        height: '20%',
        margin: '0px',
        // border: '1px solid',
        borderRadius: '10px',
        width: '100%',
    },
});

const EmptyContentComp: React.FC<{ label: string } & React.HTMLAttributes<any>> = ({ label }) => {
    const classes = useStyle();
    const [state] = useContext(Context);

    const EmptyComp = !state.isLoading ? (
        <Box className={label === 'פתקים' ? classes.noteWrapper : classes.iconWrapper}>
            <Typography variant="h2" component="div" style={{ textAlign: 'center', opacity: '0.9' }}>
                {`לא קיימים ${label}`}
                <AutorenewIcon fontSize="large" />
            </Typography>
        </Box>
    ) : (
        <Box>
            <Typography variant="h2" component="div" style={{ textAlign: 'center' }}>
                {`טוען ${label}...`}
                <CloudSyncIcon fontSize="large" />
            </Typography>
        </Box>
    );
    return EmptyComp;
};

export default EmptyContentComp;
