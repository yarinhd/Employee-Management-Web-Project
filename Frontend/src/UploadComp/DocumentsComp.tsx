/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Icon,
    IconButton,
    makeStyles,
} from '@material-ui/core';

import Typography from '@mui/material/Typography';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import CloudSyncIcon from '@mui/icons-material/CloudSync';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import { InputLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { getUserDocsBySub, uploadDocument, deleteDocument, downloadDocument, updateDocument } from '../services/user';
import useWrapFetch from '../hooks/useWrapFetch';
import { Context } from '../store/Store';
import { IDocument } from '../models/IDocument';
import ActionModal from './ActionModal';
import DocumentIcon from './DocumentIcon';
import DocumentUpload from './DocumentUpload';
import FlipCardList from '../components/PersonalInfo/FlipCardList';

import IUser from '../models/IUser';
import EmptyContentComp from '../components/EmptyContent/EmptyContent';
import toastHandler from '../Utils/toastHandler';

export type FileUploadProps = {
    title: string;
    subject: string;
    accept: string;
    hoverLabel?: string;
    dropLabel?: string;
    width?: string;
    height?: string;
    backgroundColor?: string;
};

const useStyle = makeStyles({
    cardHeaderStyle: {
        background: 'linear-gradient(to right, #5680E9, #84CEEB)',
        color: '#fff',
        height: '7%',
        padding: '1%',
        opacity: 1,
    },
    cardHeaderFilter: {
        margin: '0',
        // background: '#fff',
        color: '#fff',
        height: '100%',
        width: '15%',
        opacity: 1,
    },
    filterFont: {
        '&.MuiTypography-root': {
            fontSize: '1vw',
            lineHeight: '1.5vw',
            fontWeight: '500',
        },
    },

    generalCard: {
        marginTop: '1%',
        width: '100%',
        height: '85vh',
    },
});

const sortDocumentsByDate = (DocumentsArray: IDocument[]) => {
    DocumentsArray.sort(function (doc1, doc2) {
        return Number(new Date(doc2.createdAt as string)) - Number(new Date(doc1.createdAt as string));
    });
    return DocumentsArray;
};

const compareStrings = (string1: string, string2: string) => {
    if (string1 < string2) return -1;
    if (string1 > string2) return 1;

    return 0;
};

const sortDocumentsByName = (DocumentsArray: IDocument[]) => {
    DocumentsArray.sort(function (doc1, doc2) {
        const firstName1: string = ((doc1.createdBy as IUser).fullName as string).split(' ')[0] as string;
        const firstName2: string = ((doc2.createdBy as IUser).fullName as string).split(' ')[0] as string;
        return compareStrings(firstName1, firstName2);
    });
    return DocumentsArray;
};

export const DocumentsComp: React.FC<FileUploadProps> = ({
    title,
    subject,
    accept,
    hoverLabel = 'Click or drag to upload file',
    dropLabel = 'Drop file here',
    width = '600px',
    height = '500px',
    backgroundColor = '#fff',
}) => {
    const classes = useStyle();
    const [documentId, setDocumentId] = React.useState<string | null>(null);
    const [state, dispatch] = useContext(Context);

    const [userDocuments, setUserDocuments] = React.useState<IDocument[]>([]);
    const [openDeletionModal, setOpenDeletionModal] = React.useState<boolean>(false);
    const [openChangeModal, setOpenUpdateModal] = React.useState<boolean>(false);
    const downloadDocumentWrapped = useWrapFetch(downloadDocument);
    const uploadDocumentWrapped = useWrapFetch(uploadDocument);
    const getUserDocsWrapped = useWrapFetch(getUserDocsBySub);
    const deleteUserDocumentWrapped = useWrapFetch(deleteDocument);
    const updateDocumentWrapped = useWrapFetch(updateDocument);

    const handleOpenDeletionModal = (docId: string) => {
        setOpenDeletionModal(true);
        setDocumentId(docId);
    };

    const handleOpenChangeModal = (docId: string) => {
        setOpenUpdateModal(true);
        setDocumentId(docId);
    };

    const fetchDeleteDocument = () => {
        setOpenDeletionModal(false);
        setUserDocuments((prevState) => prevState.filter((document) => document?._id !== (documentId as string)));
        deleteUserDocumentWrapped(documentId)((document) => console.log('deleted:', document));
        setDocumentId(null);
        toastHandler('success', 'הקובץ נמחק בהצלחה!');
    };
    // TODO: Stack here - how to update specific document with setDocuments!
    // after that send all to anothe activeModal and check it
    // check prevstate
    const fetchUpdateDocumentVisibility = () => {
        setOpenUpdateModal(false);
        const choosenDoc: IDocument | undefined = userDocuments.find(
            (document) => document._id === (documentId as string)
        );
        if (!choosenDoc) {
            dispatch({ type: 'SET_ERROR' });
            return;
        }

        updateDocumentWrapped(documentId, { hidden: !choosenDoc.hidden })((updatedDocument) => {
            console.log('updatedDocument:', updatedDocument);
            setUserDocuments((prevState) => {
                const updatedDocs: IDocument[] = prevState.map((document) => {
                    if (document._id === (documentId as string)) return updatedDocument;
                    return document;
                });
                toastHandler('success', `שינוי הנראות בוצע בהצלחה! כעת הקובץ ${choosenDoc.hidden ? 'גלוי' : 'מוסתר'}.`);

                return updatedDocs;
            });
        });
        setDocumentId(null);
    };

    const handleCloseDeletionModal = () => {
        setOpenDeletionModal(false);
    };
    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    };

    useEffect(() => {
        getUserDocsWrapped(
            (state.chosenUser?._id || state.user?._id) as string,
            subject,
            state.user?._id
        )((documents: IDocument[]) => {
            setUserDocuments(sortDocumentsByDate(documents));
        });

        // TODO: ask almog if that is ok to put it as dependency
    }, [state.chosenUser]);

    const fetchUploadDocument = (
        event: React.MouseEvent<HTMLButtonElement>,
        fileToUpload: File,
        hiddenFile: boolean
    ) => {
        event.preventDefault();
        uploadDocumentWrapped(
            state.chosenUser?._id as string,
            subject,
            hiddenFile,
            fileToUpload as File
        )((document) => {
            console.log('response', document);
            setUserDocuments((prevState) => [document].concat(prevState));
            toastHandler('success', 'העלאת הקובץ בוצעה בהצלחה!');
        });
    };

    const fetchDownloadDocument = (docuemntId: string) => {
        console.log('hiiiiiii', docuemntId);

        downloadDocumentWrapped(docuemntId)((document) => {
            console.log('response', document);
            toastHandler('success', 'ההורדה החלה בהצלחה!');
        });
    };

    const [filterValue, setFilterValue] = React.useState<string>('date');

    const handleChangeFilter = (event: SelectChangeEvent) => {
        setFilterValue(event.target.value);
        console.log('value', event.target.value);

        switch (event.target.value) {
            case 'date':
                setUserDocuments(sortDocumentsByDate([...userDocuments]));
                break;
            case 'uploadedBy':
                setUserDocuments(sortDocumentsByName([...userDocuments]));
                break;
            default:
                setUserDocuments(sortDocumentsByDate([...userDocuments]));
        }
    };

    const isMyPage = state.user?._id !== state.chosenUser?._id;

    //* TODO: move whole hard code to config */

    return (
        <>
            <ActionModal
                open={openDeletionModal}
                handleClose={handleCloseDeletionModal}
                handleAction={fetchDeleteDocument}
                modalText={{
                    question: 'האם ברצונך למחוק את המסמך?',
                    description: ' אישור הפעולה תביא למחיקת המסמך לצמיתות.',
                    approve: 'מחיקה🗑️♻️',
                    cancel: 'ביטול❌',
                }}
            />
            <ActionModal
                open={openChangeModal}
                handleClose={handleCloseUpdateModal}
                handleAction={fetchUpdateDocumentVisibility}
                modalText={{
                    question: 'האם ברצונך לשנות את נראות המסמך?',
                    description: 'אישור הפעולה תביא לשינוי נראות המסמך.',
                    approve: 'שינוי✅',
                    cancel: 'ביטול❌',
                }}
            />

            <Card raised className={classes.generalCard}>
                <CardHeader
                    className={classes.cardHeaderStyle}
                    title={
                        <Typography variant="h6" component="div">
                            {title}
                        </Typography>
                    }
                    action={
                        <FormControl
                            variant="outlined"
                            style={{ height: '40px', width: '100%', backgroundColor: 'transparent' }}
                        >
                            <InputLabel
                                id="demo-simple-select-standard-label"
                                style={{ height: '40px', width: '100%' }}
                            >
                                סדר על פי
                            </InputLabel>
                            <Select
                                style={{ height: '40px', width: '100%' }}
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={filterValue}
                                onChange={handleChangeFilter}
                                label="סדר על פי"
                            >
                                <MenuItem value="date">
                                    <Typography className={classes.filterFont} component="div">
                                        תאריך
                                    </Typography>
                                </MenuItem>
                                <MenuItem value="uploadedBy">
                                    <Typography className={classes.filterFont} component="div">
                                        משתמש
                                    </Typography>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    }
                    classes={{ action: classes.cardHeaderFilter }}
                />
                {/* TODO: add block for uploading files to your own page */}
                <CardContent style={{ paddingBottom: '0.05%', height: `${isMyPage ? '60%' : '80%'}` }}>
                    {userDocuments.length ? (
                        <DocumentIcon
                            userDocuments={userDocuments}
                            openDeletionModal={handleOpenDeletionModal}
                            openChangeModal={handleOpenChangeModal}
                            Download={fetchDownloadDocument}
                        />
                    ) : (
                        <EmptyContentComp label="קבצים" />
                    )}
                </CardContent>
                {isMyPage && (
                    <CardActions style={{ padding: '16px', height: '20%' }}>
                        <DocumentUpload
                            hoverLabel={hoverLabel}
                            dropLabel={dropLabel}
                            width={width}
                            height={height}
                            backgroundColor={backgroundColor}
                            accept={accept}
                            fileUploadHandler={fetchUploadDocument}
                        />
                    </CardActions>
                )}
            </Card>
        </>
    );
};

DocumentsComp.defaultProps = {
    hoverLabel: 'Click or drag to upload file',
    dropLabel: 'Drop file here',
    width: '600px',
    height: '100px',
    backgroundColor: '#fff',
};
