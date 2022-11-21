import { Box, makeStyles } from '@material-ui/core';
import React from 'react';
import UserSections from '../components/UserSections';
import UsersTable from '../components/UsersTable/UsersTable';

// component for registering user at first login to the system

const useStyles = makeStyles(() => ({
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
}));

const Pakoodim: React.FC = () => {
    return (
        <Box className="box">
            <UsersTable />
            {/* <FileUpload {...fileUploadProp} /> */}
            {/* <UserSections /> */}
        </Box>
    );
};

export default Pakoodim;
