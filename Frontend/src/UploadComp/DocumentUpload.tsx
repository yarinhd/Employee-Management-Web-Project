import { Box, Button, Grid, makeStyles } from '@material-ui/core';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Typography from '@mui/material/Typography';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import clsx from 'clsx';

import { FileIcon, defaultStyles } from 'react-file-icon';

import React, { useContext } from 'react';
import { Context } from '../store/Store';
import useWrapFetch from '../hooks/useWrapFetch';
import { uploadDocument } from '../services/user';

type DocUploadProps = {
    hoverLabel: string;
    dropLabel: string;
    width: string;
    height: string;
    backgroundColor: string;
    accept: string;
    fileUploadHandler: (event: React.MouseEvent<HTMLButtonElement>, fileToUpload: File, hiddenFile: boolean) => void;
};

const useStyle = makeStyles({
    root: {
        cursor: 'pointer',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        '&:hover p,&:hover svg,& img': {
            opacity: 1,
        },
        '& p, svg': {
            opacity: 0.4,
        },
        '&:hover img': {
            opacity: 0.1,
        },
        '&.MuiTypography-root': {
            height: '20%',
            width: '90%',
            textAlign: 'center',
            lineHeight: 'unset',
            fontSize: '80%',
            overflow: 'hidden',
            wordBreak: 'break-word',
        },
    },
    buttonStyle: {
        height: '30%',
        margin: '0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        background: 'linear-gradient(90deg, #84CEEB 0%, #5680e9 100%)',
        '&:hover': {
            background: 'linear-gradient(0deg, #5AB9EA 0%, #84CEEB 50%, #5AB9EA 100%)',
            boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 8px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
            // color: '#ffffff',
        },
        // background: 'linear-gradient(to right, #08AEEA, #2AF598)',
        '&:disabled': {
            cursor: 'not-allowed',
            opacity: '0.6',
            pointerEvents: 'fill',
            background: 'linear-gradient(90deg, #84CEEB 0%, #5680e9 100%)',
            '&:hover': { background: 'inherent' },
        },
    },
    noMouseEvent: {
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        borderRadius: '10px',
    },
    onDragOver: {
        '& img': {
            opacity: 0.3,
        },
        '& p, svg': {
            opacity: 1,
        },
    },
    uploadWrapper: {
        display: 'flex',
        flexDirection: 'row',
        margin: '0px',
        borderRadius: '10px',
        width: '100%',
        height: '100%',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    flexActionGrid: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    flexCenter: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hidden: {
        display: 'none',
    },
    iconText: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'inherit',
        height: 'inherit',
    },
    flexComp: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        '& svg': { height: '40%', width: '100%' },
    },
    fileContainer2: {
        height: '100%',
        margin: '0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        border: '2px solid black',
    },
    uploaded: {
        height: '100%',
        margin: '0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        background: 'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
        boxShadow: '4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)',
    },
    notUploaded: {
        height: '100%',
        margin: '0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '10px',
        background: 'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)',
        boxShadow: '4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38)',
    },
    flexUpload: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const DocumentUpload: React.FC<DocUploadProps> = ({
    hoverLabel,
    dropLabel,
    width,
    height,
    backgroundColor,
    accept,
    fileUploadHandler,
}) => {
    const classes = useStyle();
    const [fileToUpload, setFileToUpload] = React.useState<File | null>(null);
    const [hiddenFile, setHiddenFile] = React.useState(true);
    const [, dispatch] = useContext(Context);
    const [labelText, setLabelText] = React.useState<string>(hoverLabel);
    const [isDragOver, setIsDragOver] = React.useState<boolean>(false);
    const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileToUpload(event.target.files![0]);
    };
    const handleHiddenFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHiddenFile(event.target.checked);
    };

    const handleUploadDocument = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (fileToUpload !== null) {
            fileUploadHandler(event, fileToUpload, hiddenFile);
        }
        console.log('ssssssssssssssssssssssssssssssssssssssssssssssss');

        setFileToUpload(null);
    };

    const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
        setFileToUpload(null);
    };

    const stopDefaults = (e: React.DragEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };
    const dragEvents = {
        onMouseEnter: () => {
            setIsMouseOver(true);
        },
        onMouseLeave: () => {
            setIsMouseOver(false);
        },
        onDragEnter: (e: React.DragEvent) => {
            stopDefaults(e);
            setIsDragOver(true);
            setLabelText(dropLabel);
        },
        onDragLeave: (e: React.DragEvent) => {
            stopDefaults(e);
            setIsDragOver(false);
            setLabelText(hoverLabel);
        },
        onDragOver: stopDefaults,
        onDrop: (e: React.DragEvent<HTMLElement>) => {
            stopDefaults(e);
            setLabelText(hoverLabel);
            setIsDragOver(false);
            setFileToUpload(e.dataTransfer.files![0]);

            // Ask Almog: why is that here?
        },
    };

    return (
        <Box className={classes.uploadWrapper}>
            <Grid item container className={classes.flexActionGrid}>
                <Grid item xs={6} className={classes.fileContainer2}>
                    <input
                        onChange={handleChange}
                        accept={accept}
                        className={classes.hidden}
                        id="file-upload"
                        type="file"
                    />
                    <label
                        htmlFor="file-upload"
                        {...dragEvents}
                        className={clsx(classes.root, isDragOver && classes.onDragOver)}
                    >
                        <Box width={width} height={height} bgcolor={backgroundColor} className={classes.noMouseEvent}>
                            {(!isDragOver || !isMouseOver) && (
                                <Box height={height} width={width} className={classes.iconText}>
                                    <CloudUploadIcon fontSize="large" />
                                    <Typography>{labelText}</Typography>
                                </Box>
                            )}
                        </Box>
                    </label>
                </Grid>
                <Grid item xs={2} className={fileToUpload ? classes.uploaded : classes.notUploaded}>
                    <div className={classes.flexCenter}>
                        {!fileToUpload && (
                            <>
                                <Typography variant="h6" component="div">
                                    לא נבחר קובץ
                                </Typography>
                                <CancelIcon />
                            </>
                        )}
                        {fileToUpload && (
                            <div className={classes.flexUpload}>
                                <Box className={classes.flexComp}>
                                    <Typography variant="h6">הקובץ הנבחר:</Typography>
                                    <FileIcon
                                        fold
                                        extension={fileToUpload.name.split('.').pop()}
                                        {...defaultStyles[
                                            fileToUpload.name.split('.').pop() as keyof typeof defaultStyles
                                        ]}
                                    />{' '}
                                    <Typography className={classes.root} variant="subtitle1">
                                        {fileToUpload.name}
                                    </Typography>
                                </Box>
                            </div>
                        )}
                    </div>
                </Grid>
                <Grid
                    item
                    xs={3}
                    className={classes.flexCenter}
                    style={{ flexWrap: 'wrap', justifyContent: 'space-evenly' }}
                >
                    {fileToUpload && (
                        <FormControlLabel
                            sx={{ width: '100%', height: '22%', margin: '0 0 0 0' }}
                            label="העלאה כקובץ מוסתר"
                            control={<Checkbox checked={hiddenFile} onChange={handleHiddenFileChange} />}
                        />
                    )}
                    <Button
                        variant="contained"
                        onClick={handleUploadDocument}
                        disabled={!fileToUpload}
                        className={classes.buttonStyle}
                        endIcon={<FileUploadIcon />}
                    >
                        <Typography variant="h6" component="div" m={1}>
                            העלאה
                        </Typography>
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCancel}
                        disabled={!fileToUpload}
                        className={classes.buttonStyle}
                        endIcon={<DeleteForeverIcon />}
                    >
                        <Typography variant="h6" component="div" m={1}>
                            ביטול
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DocumentUpload;
