import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, makeStyles, Typography } from '@material-ui/core';
import IModal from '../models/IModal';
import { IDocument } from '../models/IDocument';

type Props = {
    open: boolean;
    handleClose: () => void;
    handleAction: () => void;
    modalText: IModal;
};

const useStyle = makeStyles({
    root: {
        '&.MuiButton-root': {
            width: '100%',
        },
        '&.MuiDialogActions-root': {
            display: 'flex',
            justifyContent: 'space-evenly',
            borderRadius: '10px',
        },
    },
});

const ActionModal: React.FC<Props> = ({ open, handleClose, handleAction, modalText }) => {
    const classes = useStyle();

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{modalText.question}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{modalText.description}</DialogContentText>
            </DialogContent>
            <DialogActions className={classes.root}>
                <Button onClick={handleClose} className={classes.root}>
                    <Typography variant="h6">{modalText.cancel}</Typography>
                </Button>
                <Button onClick={handleAction} autoFocus className={classes.root}>
                    <Typography variant="h6">{modalText.approve}</Typography>
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActionModal;
