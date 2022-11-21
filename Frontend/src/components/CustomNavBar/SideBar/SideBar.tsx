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
import { Button, Collapse, IconButton } from '@mui/material';
import { ExpandMore } from '@material-ui/icons';
import { ExpandLess } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SidebarLink from './SidebarLink';
import './SidebarLink.css';

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
}));

const Sidebar: React.FC<React.HTMLAttributes<any>> = () => {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();
    const handleClick = () => {
        setOpen(!open);
    };
    const classes = useStyles();

    const navigateHandler = (route: string) => {
        navigate(route);
    };

    return (
        <Toolbar className={classes.sidebar}>
            <SidebarLink text="הערות אישיות" Icon={HomeIcon} onNavigate={navigateHandler} route="/notes" />
            <SidebarLink text='שיחות פ"א' Icon={MailLockIcon} onNavigate={navigateHandler} route="/peyalef" />
            <SidebarLink text="שיחות חתך" Icon={FolderCopyIcon} onNavigate={navigateHandler} route="/hatah" />
            <SidebarLink text="חווד מפקדים" Icon={AdminPanelSettingsIcon} onNavigate={navigateHandler} route="/havad" />

            <SidebarLink text="הפקודים שלי" Icon={GroupsIcon} onNavigate={navigateHandler} route="/pakoodim" />
            <SidebarLink
                text="פרטים אישיים"
                Icon={EnhancedEncryptionIcon}
                onNavigate={navigateHandler}
                route="/personalDetails"
            />
        </Toolbar>
    );
};
export default Sidebar;
