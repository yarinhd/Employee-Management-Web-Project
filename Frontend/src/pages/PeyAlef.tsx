import { Box, Button, makeStyles, Paper } from '@material-ui/core';
import React, { useContext } from 'react';
import SimpleAccordion from '../components/UserSections';
import useWrapFetch from '../hooks/useWrapFetch';
import { uploadDocument } from '../services/user';
import { Context } from '../store/Store';
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

const PeyAlef: React.FC = () => {
    const fileUploadProp: FileUploadProps = {
        title: 'שיחות פא',
        subject: String('פ"א'),
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

export default PeyAlef;
