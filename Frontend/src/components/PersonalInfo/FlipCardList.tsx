import React from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import config from '../../config';
import FlipCardItem from './FlipCard/FlipCardItem';
import IUser from '../../models/IUser';

const useStyles = makeStyles(() => ({
    ulStyle: {
        listStyle: 'none',
        padding: '1%',
    },
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
}));

const { userFields } = config.DUMMY_DATA;

const FlipCardList: React.FC<{ cubeItems: IUser } & React.HTMLAttributes<any>> = (props) => {
    const classes = useStyles();
    const { cubeItems } = props;
    console.log(cubeItems, userFields);

    return (
        <ul className={classes.ulStyle}>
            <Grid container spacing={4} className={classes.containerStyle}>
                {userFields.map((key) => (
                    <Grid key={key} item xs={3}>
                        <FlipCardItem
                            key={key}
                            boxData={{ [`${key}`]: `${cubeItems[key as keyof typeof cubeItems]}` }}
                        />
                    </Grid>
                ))}
            </Grid>
        </ul>
    );
};

export default FlipCardList;
