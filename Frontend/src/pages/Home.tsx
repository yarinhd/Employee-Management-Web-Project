import { Box, makeStyles, Paper } from '@material-ui/core';
import { Typography } from '@mui/material';
import React from 'react';
import MainLayout from '../components/CustomNavBar/MainLayout';
import InfoCard from '../components/PersonalInfo/FlipCard/FlipCardItem';
import FlipCardComp from '../components/PersonalInfo/FlipCardGeneral';
import FlipCardList from '../components/PersonalInfo/FlipCardList';
import config from '../config';
// component for registering user at first login to the system

const useStyles = makeStyles(() => ({
    paper: {
        display: 'flex',
        padding: '0px 40px',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        spacing: '2000px',
    },
    box: {
        display: 'flex',
        // padding: '0 96px',
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
    divider: {
        borderTop: '3px dotted #bbb',
    },
    ulStyle: {
        listStyle: 'none',
    },
}));

// const { user } = config.DUMMY_DATA;

const Home: React.FC = () => {
    const classes = useStyles();
    return (
        <Box className={classes.box}>
            <FlipCardComp />
        </Box>
        // <FlipCardList cubeItems={user} />
    );
};

export default Home;
