import { Box, Button, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { FileUploadProps, DocumentsComp } from '../UploadComp/DocumentsComp';
// import { FileUpload, FileUploadProps } from '../components/uploadFile/fileUpload';

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

const Havad: React.FC = () => {
    const fileUploadProp: FileUploadProps = {
        title: 'חווד מפקדים',
        subject: String('חוו"ד מפקדים'),
        accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return (
        <Box className="box">
            {/* <FileUpload {...fileUploadProp} imageButton/> */}
            {/* <FileUpload {...fileUploadProp} /> */}
            <DocumentsComp {...fileUploadProp} />
        </Box>
    );
    // const classes = useStyles();
    // return (
    //     <label htmlFor="raised-button-file">
    //         <input accept="image/*" style={{ display: 'none' }} id="raised-button-file" multiple type="file" />
    //         <Button variant="contained" component="span">
    //             Upload
    //         </Button>
    //     </label>
    // );
};

export default Havad;
