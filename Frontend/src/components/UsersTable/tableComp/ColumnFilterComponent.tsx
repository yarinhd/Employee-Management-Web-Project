import { makeStyles } from '@material-ui/core';
import React from 'react';


const useStyles = makeStyles(() => ({
    boxFilter: {
        maxWidth: '95%',
        textAlign: 'center',
        borderRadius: '1vh',
        '&:hover': {
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 2px, rgb(51, 51, 51) 0px 0px 0px 2px',
        },
    },
}));

const ColumnFilter = ({ column }: any) => {
    const classes = useStyles();
    const { filterValue, setFilter } = column;
    return (
        <span>
            <input
                className={classes.boxFilter}
                value={filterValue || ''}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="הקלד / הקש לסיווג"
            />
        </span>
    );
};

export default ColumnFilter;
