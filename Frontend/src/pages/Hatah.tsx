import { Box, Button, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FileUploadProps, DocumentsComp } from '../UploadComp/DocumentsComp';
// import { FileUpload, FileUploadProps } from '../components/uploadFile/fileUpload';


const useStyles = makeStyles(() => ({
    box: {
        display: 'flex',
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

const Hatah: React.FC = () => {
    const fileUploadProp: FileUploadProps = {
        title: 'שיחות חתך',
        subject: String('שיחות חתך'),
        accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return (
        <Box className="box">

            <DocumentsComp {...fileUploadProp} />
        </Box>
    );

};

export default Hatah;
