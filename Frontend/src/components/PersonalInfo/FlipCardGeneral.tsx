import React, { useContext } from 'react';
import { Box, Card, CardActions, CardContent, CardHeader, Grid, Icon, makeStyles } from '@material-ui/core';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import FlipCardList from './FlipCardList';
import { Context } from '../../store/Store';
import IUser from '../../models/IUser';

const useStyle = makeStyles({
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        '&:hover p,&:hover svg,& img': {
            opacity: 1,
        },
        '& p, svg': {
            opacity: 0.4,
        },
        '&:hover img': {
            opacity: 0.1,
        },
    },
    noMouseEvent: {
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'absolute',
    },
    hidden: {
        display: 'none',
    },
    onDragOver: {
        '& img': {
            opacity: 0.3,
        },
        '& p, svg': {
            opacity: 1,
        },
    },
    iconWrapper: {
        display: 'block',
        flexDirection: 'row',
        height: '100%',
        margin: '0px',
        border: '1px solid',
        borderRadius: '10px',
        width: '100%',
        // height: '100%',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    uploadWrapper: {
        display: 'flex',
        flexDirection: 'row',
        margin: '0px',
        border: '1px solid',
        borderRadius: '10px',
        width: '100%',
        height: '100%',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    fileContainer: {
        height: '100px',
        margin: '20px',
        width: '50px',
        // height: '20%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    allBox: {
        maring: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
    },
    generalCard: {
        marginTop: '1%',
        width: '100%',
        height: '75vh',
    },
});

const theme = createTheme({
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});
// const { user } = config.DUMMY_DATA;

const FlipCardComp: React.FC = () => {
    const [state, dispatch] = useContext(Context);

    const classes = useStyle();
    return (
        <ThemeProvider theme={theme}>
            {/* <Grid item xs={12}> */}
            <Card raised className={classes.generalCard}>
                <CardHeader
                    style={{
                        textAlign: 'right',
                        background: 'linear-gradient(to left, #5680E9, #84CEEB)',
                        color: '#fff',
                        height: '5%',
                        opacity: 1,
                    }}
                    title={<Typography variant="h6">{String('פרטים אישיים')}</Typography>}
                />

                <CardContent style={{ paddingBottom: '0.05%', height: '83%' }}>
                    <Box className={classes.iconWrapper}>
                        <FlipCardList cubeItems={state.user as IUser} />
                    </Box>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default FlipCardComp;
