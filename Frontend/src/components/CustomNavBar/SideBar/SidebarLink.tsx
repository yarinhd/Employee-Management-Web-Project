import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import './SidebarLink.css';

type Props = {
    text: string;
    Icon: any;
    onNavigate: (route: string) => void;
    route: string;
    // eslint-disable-next-line react/require-default-props
};

const useStyles = makeStyles(() => ({
    link: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        cursor: 'pointer',
        borderRadius: '30px',
        color: 'rgb(0, 0, 0)',
        '&:hover': {
            backgroundColor: '#e8f5fe',
            color: '#50b7f5',
            borderRadius: '30px',
            transition: 'color 100ms ease-out',
        },
        '& h2': { fontWeight: '700', fontSize: '130%', marginRight: '5px' },
        '&.MuiButton-root': {
            '& span': {
                display: 'inherit',
                alignItems: 'inherit',
                height: '7vh',
            },
        },
    },
    icon: {
        '&.MuiSvgIcon-root': { padding: '5px', fontSize: 'x-large' },
    },
}));
const SidebarLink: React.FC<Props & React.HTMLAttributes<any>> = ({ children, text, Icon, onNavigate, route }) => {
    const classes = useStyles();
    const clickHandler = () => {
        onNavigate(route);
    };

    return (
        <Button
            disableRipple
            className={classes.link}
            onClick={clickHandler}
            startIcon={<Icon className={classes.icon} />}
        >
            <h2>{text}</h2>
            {children}
        </Button>
    );
};
export default SidebarLink;
