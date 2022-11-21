import { Box, Button, Grid, IconButton, makeStyles } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { defaultStyles, FileIcon } from 'react-file-icon';

import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import React, { useContext } from 'react';
import { Tooltip } from '@mui/material';
import { IDocument } from '../models/IDocument';
import IUser from '../models/IUser';
import { Context } from '../store/Store';

type DocHeaderProps = {
    userDocuments: IDocument[];
    openDeletionModal: (docId: string) => void;
    openChangeModal: (docId: string) => void;
    Download: (docuemntId: string) => void;
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
            display: 'flex',
            justifyContent: 'center',
            height: '1.5vw',
            fontSize: '0.85vw',
            lineHeight: '1.5vw',
            width: '90%',
            textAlign: 'center',

            overflow: 'hidden',
            wordBreak: 'break-word',
        },
    },
    root2: {
        '&.MuiButton-root': {
            height: '90%',
            width: '90%',
            padding: '0',
            border: '0px solid white',
            borderRadius: '1em',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',

            '& span': {
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            },
            '&:hover': {
                border: '#fff 0.2em solid ',
                background: '#5680e982  ',
                borderRadius: '1em',
            },
        },
    },
    wrapDocHeader: {
        width: '75%',
        height: '25%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        flexDirection: 'row',
        margin: '1% 0px 1% 0px',
    },
    hiddenDoc: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '2em',
        background: '#7c82c1cc',
        padding: '0px 2% 0px 2%',
        '&.MuiButton-root': {
            minWidth: 'min-content',
            border: '2px solid black',
            '&.Mui-disabled': {
                color: 'black',
                border: 'none',
            },
        },
    },
    exposedDoc: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '2em',
        background: '#7aec93cc',
        padding: '0px 2% 0px 2%',
        '&.MuiButton-root': {
            minWidth: 'min-content',
            border: '2px solid black',
            '&.Mui-disabled': {
                color: 'black',
                border: 'none',
            },
        },
    },
    createdByText: {
        '&.MuiTypography-root': {
            opacity: '0.7',
            width: '90%',
            textAlign: 'center',
            fontSize: '0.65vw',
            lineHeight: '1vw',
            height: '1vw',
            overflow: 'hidden',
            wordBreak: 'break-word',
        },
    },
    iconWrapper: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
        margin: '0px',
        border: '1px solid',
        borderRadius: '10px',
        alignContent: 'flex-start',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
    },
    documentsContainer: {
        height: '100%',
        width: '100%',
        maring: '0px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start !important',
        overflow: 'overlay',
        textAlign: 'center',
        alignContent: 'flex-start',
        alignItems: 'baseline',
    },
    fileContainer: {
        height: '20vh',
        width: '20%',
        padding: '0.5% 0px 2% 0px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexWarp: 'warp',
        positon: 'absolute',
        '&:hover': {
            background: '#5680e914',
            borderRadius: '1em',
        },
    },
    fileImg: {
        height: '48%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexWarp: 'warp',
    },
});

const DocumentIcon: React.FC<DocHeaderProps> = ({ userDocuments, openDeletionModal, openChangeModal, Download }) => {
    const classes = useStyle();
    const [state] = useContext(Context);
    return (
        <Box className={classes.iconWrapper}>
            {userDocuments !== null && (
                <Grid container className={classes.documentsContainer}>
                    {(userDocuments as IDocument[]).map((document: IDocument) => (
                        <Grid item xs={2} key={document._id} className={classes.fileContainer}>
                            <div className={classes.wrapDocHeader}>
                                {document.hidden ? (
                                    <Tooltip title="לחץ לחשיפת הקובץ ">
                                        <Button
                                            className={classes.hiddenDoc}
                                            disabled={state.user?._id !== (document.createdBy as IUser)._id}
                                            onClick={() => openChangeModal(document._id as string)}
                                        >
                                            <VisibilityOffIcon fontSize="inherit" />
                                            <Typography
                                                sx={{
                                                    fontSize: '12px',
                                                }}
                                                variant="subtitle2"
                                                component="div"
                                            >
                                                &nbsp; מוסתר
                                            </Typography>
                                        </Button>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="לחץ להסתרת הקובץ">
                                        <Button
                                            className={classes.exposedDoc}
                                            disabled={state.user?._id !== (document.createdBy as IUser)._id}
                                            onClick={() => openChangeModal(document._id as string)}
                                        >
                                            <VisibilityOutlinedIcon fontSize="inherit" />
                                            <Typography
                                                sx={{
                                                    fontSize: '12px',
                                                }}
                                                variant="subtitle2"
                                                component="div"
                                            >
                                                &nbsp; גלוי
                                            </Typography>
                                        </Button>
                                    </Tooltip>
                                )}
                                <div
                                    style={{
                                        borderRadius: '50%',
                                        background: '#ff010124',
                                    }}
                                >
                                    {state.user?._id === (document.createdBy as IUser)._id && (
                                        <Tooltip title="מחק">
                                            <IconButton
                                                aria-label="delete"
                                                size="small"
                                                onClick={() => openDeletionModal(document._id as string)}
                                            >
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                            <Tooltip
                                title={
                                    <div>
                                        לחץ להורדה
                                        <br />
                                        שם הקובץ: {document.fileName}
                                    </div>
                                }
                            >
                                <Button className={classes.root2} onClick={() => Download(document._id as string)}>
                                    <Box
                                        className={classes.fileImg}
                                        style={{ opacity: `${document.hidden ? '0.5' : '1'}` }}
                                    >
                                        <FileIcon
                                            fold
                                            extension={document.fileName!.split('.').pop()}
                                            {...defaultStyles[
                                                document.fileName?.split('.').pop() as keyof typeof defaultStyles
                                            ]}
                                        />
                                    </Box>

                                    <Typography className={classes.root} variant="subtitle2" component="div">
                                        {document.fileName!}
                                    </Typography>
                                    <Typography
                                        dir="ltr"
                                        className={classes.createdByText}
                                        variant="subtitle2"
                                        component="div"
                                    >
                                        הועלה על ידי: &nbsp; {(document.createdBy as IUser).fullName}
                                    </Typography>
                                    <Typography
                                        dir="ltr"
                                        className={classes.createdByText}
                                        variant="subtitle2"
                                        component="div"
                                    >
                                        {(document.createdAt as string).slice(0, 10)} &nbsp; :תאריך העלאה
                                    </Typography>
                                </Button>
                            </Tooltip>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default DocumentIcon;
