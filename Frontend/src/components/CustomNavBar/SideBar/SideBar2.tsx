import { makeStyles, Toolbar } from '@material-ui/core';
import * as React from 'react';
import Divider from '@mui/material/Divider';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import MailLockIcon from '@mui/icons-material/MailLock';
import GroupsIcon from '@mui/icons-material/Groups';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PolicyIcon from '@mui/icons-material/Policy';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import ListAltIcon from '@material-ui/icons/ListAlt';
import {
    Button,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import { ExpandMore } from '@material-ui/icons';
import { ExpandLess } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SidebarLink from './SidebarLink';
import './SidebarLink.css';
import { Context } from '../../../store/Store';

const useStyles = makeStyles(() => ({
    sidebar: {
        // width: '20vw',
        // minWidth: '33vw',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignContent: 'center',
        padding: '10px 10px',
        margin: '0px 10px 0 auto',
        borderRadius: '20px',
        background: 'linear-gradient(205deg, #5680e9e1 0%, #84ceeb 100%)',
        // boxShadow: '0px 0px 10px hsl(210 14% 90%)',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',

        // alignContent: 'space-between',
        // justifyContent: 'space-between',
    },
    sidebarStyle: {
        background: 'linear-gradient(205deg, #5680e9e1 0%, #84ceeb 100%)',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px',
        padding: '10px 10px',
        margin: '0px 10px 0 auto',
        borderRadius: '20px',

        '& svg': {
            color: 'black',
        },
        '&.MuiList-root': {
            paddingRight: '4%',
            paddingLeft: '2%',
        },
    },
    selectedItem: {
        margin: '10px 0 10px 0',

        '&.MuiListItem-root.Mui-selected': {
            backgroundColor: '#e8f5fe',
            color: '#50b7f5',
            borderRadius: '2em',
        },
    },
    regularText: {
        '&.MuiTypography-root': {
            fontWeight: 650,
            color: 'black',
            fontSize: '2.5vh',
        },
    },
    link: {
        '&.MuiButtonBase-root': {
            height: '8vh',
            '&:hover': {
                backgroundColor: '#e8f5fe',
                color: '#50b7f5',
                borderRadius: '2em',
                transition: 'background-color 150ms ease-out',
            },
            '&.MuiListItemButton-root': {
                transition: 'background-color 150ms ease-out',
                borderRadius: '2em',
            },
        },
    },
}));

const sideBarItems = [
    { text: 'הערות אישיות', route: '/notes', icon: <HomeIcon /> },
    { text: 'שיחות פ"א', route: '/peyalef', icon: <MailLockIcon /> },
    { text: 'שיחות חתך', route: '/hatah', icon: <FolderCopyIcon /> },
    { text: 'חווד מפקדים', route: '/havad', icon: <AdminPanelSettingsIcon /> },
    { text: 'הפקודים שלי', route: '/pakoodim', icon: <GroupsIcon /> },
    { text: 'פרטים אישיים', route: '/personalDetails', icon: <EnhancedEncryptionIcon /> },
];

const Sidebar: React.FC<React.HTMLAttributes<any>> = () => {
    const [state, dispatch] = React.useContext(Context);

    const navigate = useNavigate();
    const handleClick = (event: React.MouseEvent<HTMLElement>, route: string, index: number) => {
        navigate(route);
        dispatch({ type: 'SET_SELECTED_INDEX', payload: index });
    };
    const classes = useStyles();

    return (
        <List className={classes.sidebarStyle}>
            {sideBarItems.map((item, index) => (
                <ListItem
                    key={item.text}
                    selected={index === state.selectedIndex}
                    disablePadding
                    className={classes.selectedItem}
                >
                    <ListItemButton onClick={(e) => handleClick(e, item.route, index)} className={classes.link}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography component="span" className={classes.regularText}>
                                    {item.text}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};
export default Sidebar;
