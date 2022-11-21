import React, { useContext, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Button,
    createTheme,
    Grid,
    IconButton,
    makeStyles,
    TextField,
    ThemeProvider,
    Typography,
} from '@material-ui/core';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import EditIcon from '@mui/icons-material/Edit';
import { Context } from '../../store/Store';
import { createNote } from '../../services/user';
import IForm from '../../models/INoteForm';
import INote from '../../models/INote';
import useWrapFetch from '../../hooks/useWrapFetch';

type Props = {
    openForm: boolean;
    handleCloseForm: () => void;
    fetchCreateNewNote: (noteData: INote) => void;
    fetchUpdateNote: (noteData: Partial<INote>) => void;
    editedNote: INote | null;
    // handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
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
            background: 'linear-gradient(0deg, #5AB9EA 0%, #84CEEB 50%, #5AB9EA 100%)',
        },
    },
});

const NoteFormDialog: React.FC<Props> = ({
    editedNote,
    openForm,
    handleCloseForm,
    fetchCreateNewNote,
    fetchUpdateNote,
}) => {
    const classes = useStyle();

    const [state] = useContext(Context);
    const [form, setForm] = React.useState<IForm>({ title: '', subtitle: '', description: '', hidden: false });
    const formNotEmpty = form.title.length > 0 && form.subtitle.length > 0 && form.description.length > 0;

    // TODO: fix the problem with the edit shit cause it should clean the form state from edit data after openning it!
    const handleCloseModal = () => {
        handleCloseForm();
        setForm({ title: '', subtitle: '', description: '', hidden: false });
    };
    useEffect(() => {
        if (editedNote?._id)
            setForm({
                title: editedNote.title,
                subtitle: editedNote.subtitle,
                description: editedNote.description,
                hidden: editedNote.hidden,
            });
    }, [editedNote]);
    console.log(`form is${JSON.stringify(form)}`);

    // const handleHiddenFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setHiddenFile(event.target.checked);
    //     setForm((prevState) => {
    //         return { ...prevState, hidden: event.target.checked };
    //     });
    // };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleCloseForm();
        if (editedNote?._id) {
            const noteUpdateData: Partial<INote> = {
                _id: editedNote._id,
                title: form.title,
                subtitle: form.subtitle,
                hidden: form.hidden,
                description: form.description,
            };
            fetchUpdateNote(noteUpdateData);
        } else {
            // setForm({ title: '', subtitle: '', description: '', hidden: false });
            const noteData: INote = {
                title: form.title,
                subtitle: form.subtitle,
                hidden: form.hidden as boolean,
                description: form.description,
                userId: state.chosenUser?._id,
                // TODO: note about that think
                // createdAt: new Date().toISOString(),
                createdBy: state.user?._id,
            };
            console.log(`noteData befor sent to backend for creation: ${JSON.stringify(noteData)}`);

            fetchCreateNewNote(noteData);
        }
    };

    return (
        <Dialog
            open={openForm}
            onClose={handleCloseModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle
                    id="alert-dialog-title"
                    style={{ background: 'linear-gradient(0deg, #5AB9EA 0%, #84CEEB 50%, #5AB9EA 100%)' }}
                >
                    <Typography variant="h6" component="span">
                        {editedNote?._id ? 'עדכון הערה קיימת' : 'יצירת הערה חדשה'}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="div" id="alert-dialog-description">
                        <FormControlLabel
                            sx={{ width: '100%', height: '22%', margin: '0 0 0 0' }}
                            label="העלאה כפתק מוסתר"
                            control={
                                <Checkbox
                                    checked={form.hidden}
                                    onChange={(e) => {
                                        setForm((prevState) => {
                                            return { ...prevState, hidden: e.target.checked };
                                        });
                                    }}
                                />
                            }
                        />
                        <TextField
                            onChange={(e) => {
                                setForm((prevState) => {
                                    return { ...prevState, title: e.target.value };
                                });
                            }}
                            multiline
                            autoFocus
                            margin="normal"
                            id="Title"
                            label="נושא"
                            type="text"
                            fullWidth
                            defaultValue={editedNote?._id ? String(`${editedNote?.title}`) : String('')}
                            variant="outlined"
                            size="small"
                            placeholder="אנא הכנס נושא"
                            style={{ background: '#ffff' }}

                            // inputRef={titleRef}
                        />
                        <TextField
                            onChange={(e) => {
                                setForm((prevState) => {
                                    return { ...prevState, subtitle: e.target.value };
                                });
                            }}
                            margin="normal"
                            id="subtitle"
                            label="מיקום"
                            type="text"
                            fullWidth
                            defaultValue={editedNote?._id ? String(`${editedNote?.subtitle}`) : String('')}
                            variant="outlined"
                            size="small"
                            placeholder="אנא הכנס מיקום/כותרת משנה"
                            // inputRef={subtitleRef}
                        />
                        <TextField
                            onChange={(e) => {
                                setForm((prevState) => {
                                    return { ...prevState, description: e.target.value };
                                });
                            }}
                            multiline
                            margin="normal"
                            id="description"
                            label="תוכן ההערה"
                            type="text"
                            fullWidth
                            defaultValue={editedNote?._id ? String(`${editedNote?.description}`) : String('')}
                            variant="outlined"
                            size="small"
                            // inputRef={descriptionRef}
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={classes.root}>
                    {/* <Button className={classes.root} onClick={() => handleCloseModal()}> */}
                    <Button className={classes.root} onClick={() => handleCloseModal()}>
                        <Typography variant="h6" component="span">
                            ביטול❌
                        </Typography>
                    </Button>
                    <Button type="submit" autoFocus disabled={!formNotEmpty} className={classes.root}>
                        <Typography variant="h6" component="span">
                            {editedNote?._id ? 'עדכון⬆️' : 'יצירה✅'}
                        </Typography>
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default NoteFormDialog;
