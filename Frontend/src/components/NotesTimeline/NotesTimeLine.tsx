import React, { useContext, useEffect, useState } from 'react';
import './NotesTimeline.css';

import DeleteIcon from '@mui/icons-material/Delete';
import { Button, createTheme, Grid, IconButton, TextField, makeStyles, Typography } from '@material-ui/core';
import EditIcon from '@mui/icons-material/Edit';

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import Moment from 'moment';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';

import 'react-vertical-timeline-component/style.min.css';
import useWrapFetch from '../../hooks/useWrapFetch';
import { createNote, deleteNote, getAllUserNotes, updateNote } from '../../services/user';
import { Context } from '../../store/Store';
import INote from '../../models/INote';

import ActionModal from '../../UploadComp/ActionModal';
import IForm from '../../models/INoteForm';
import IUser from '../../models/IUser';
import NoteFormDialog from './NoteFormDialog';
import EmptyContentComp from '../EmptyContent/EmptyContent';
import toastHandler from '../../Utils/toastHandler';
// TODO: make generic theme!

const sortNotesByDate = (NotesArray: INote[]) => {
    NotesArray.sort(function (a, b) {
        return Number(new Date(b.createdAt as string)) - Number(new Date(a.createdAt as string));
    });
    return NotesArray;
};

const useStyles = makeStyles({
    createButton: {
        width: '80%',
        borderRadius: '2px',
        margin: '20px',
        display: 'flex',
        justifyContent: 'space-evenly',
        background: 'linear-gradient(225deg, #5680E9 10%, #84CEEB 80%, #c1c8e4 100%)',
        '&:hover': {
            background: 'linear-gradient(0deg, #5AB9EA 0%, #84CEEB 50%, #5AB9EA 100%)',
        },
    },
});

const NotesTimeline: React.FC = () => {
    const classes = useStyles();

    const deleteUserNoteWrapped = useWrapFetch(deleteNote);
    const updateUserNoteWrapped = useWrapFetch(updateNote);
    const createNoteWrapped = useWrapFetch(createNote);
    const [open, setOpen] = React.useState<boolean>(false);
    const [openForm, setOpenForm] = React.useState<boolean>(false);
    const [chosenNote, setChosenNote] = React.useState<INote | null>(null);
    // const titleRef = React.useRef<HTMLInputElement>(null);
    // const subtitleRef = React.useRef<HTMLInputElement>(null);
    // const descriptionRef = React.useRef<HTMLInputElement>(null);

    const url =
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    const url2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8xlBwhEawy9A19aM4M15TPYs5rM5xGEHmBA&usqp=CAU';
    const urls = [url, url2];

    const [state, dispatch] = useContext(Context);
    const [userNotes, setUserNotes] = useState<INote[]>([]);

    // const DUMMY_NOTES: INotesTimeline[] = timelineElementsMock;
    const getAllUserNotesWrapped = useWrapFetch(getAllUserNotes);
    useEffect(() => {
        getAllUserNotesWrapped(
            state.chosenUser?._id || state.user?._id,
            state.user?._id
        )((fetchedNotes) => setUserNotes(sortNotesByDate(fetchedNotes)));
    }, [state.chosenUser]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseForm = () => {
        setChosenNote(null);
        setOpenForm(false);
    };

    const handleDelete = () => {
        setOpen(false);
        setUserNotes((prevState) => prevState.filter((note) => note?._id !== chosenNote?._id));
        deleteUserNoteWrapped(chosenNote?._id)((note) => console.log('deleted:', note));
        setChosenNote(null);
        toastHandler('success', 'ההערה נמחקה בהצלחה!');
    };

    const handleClickOpen = (note: INote) => {
        setOpen(true);
        setChosenNote(note);
    };

    const handleFormOpen = (note: INote | null = null) => {
        if (note !== null) {
            setChosenNote(note);
        }
        setOpenForm(true);
    };

    const fetchCreateNewNote = (noteData: INote) => {
        createNoteWrapped(noteData)((createdNote) => {
            console.log('created new Note:', createdNote);
            setUserNotes((prevState) => [createdNote].concat(prevState));
            console.log('userNotes', ...userNotes);
        });
        setChosenNote(null);
        toastHandler('success', 'נוצרה הערה חדשה בהצלחה!');
    };

    const fetchUpdateNote = (noteData: Partial<INote>) => {
        console.log(`NoteData is befor sending: ${noteData}`);

        updateUserNoteWrapped(noteData)((updatedNote) => {
            console.log('updated new Note:', updatedNote);
            // TODO: continue from here donw know what to do
            // need to update fields and send it to backend
            setUserNotes((prevState) => [updatedNote].concat(prevState));
        });
        setChosenNote(null);
        toastHandler('success', 'ההערה עודכנה בהצלחה!');
    };

    const isMyPage = state.user?._id === state.chosenUser?._id;

    return (
        <div>
            <ActionModal
                open={open}
                handleClose={handleClose}
                handleAction={handleDelete}
                modalText={{
                    question: 'האם ברצונך למחוק את המסמך?',
                    description: ' אישור הפעולה תביא למחיקת המסמך לצמיתות.',
                    approve: 'מחיקה🗑️♻️',
                    cancel: 'ביטול❌',
                }}
            />
            <NoteFormDialog
                openForm={openForm}
                handleCloseForm={handleCloseForm}
                fetchCreateNewNote={fetchCreateNewNote}
                editedNote={chosenNote}
                fetchUpdateNote={fetchUpdateNote}
            />

            <Grid container>
                {/* TODO: update and delete is available for avishay on dimael notes/docs fix authorization on backend and forntend */}
                {!isMyPage && (
                    <Grid
                        item
                        xs={2}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Button
                            onClick={() => {
                                handleFormOpen();
                            }}
                            variant="contained"
                            className={classes.createButton}
                            startIcon={<AddCircleIcon />}
                        >
                            <Typography variant="subtitle1" component="div">
                                צור חדש
                            </Typography>
                        </Button>
                    </Grid>
                )}
                {userNotes.length ? (
                    <Grid item xs={8}>
                        <VerticalTimeline layout="1-column-right">
                            {userNotes.map((note) => {
                                return (
                                    <VerticalTimelineElement
                                        style={{ display: 'flex' }}
                                        key={note._id}
                                        date={Moment(note.createdAt).format('DD-MM-YYYY')}
                                        dateClassName="date"
                                        icon={
                                            <img
                                                className="vertical-timeline-element-icon"
                                                alt="Remy Sharp"
                                                // TODO: need to put the url inside each img!!
                                                src={urls[Math.floor(Math.random() * urls.length)]}
                                            />
                                        }
                                    >
                                        {note.hidden ? (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: '2em',
                                                    background: '#7c82c1cc',
                                                    padding: '0px 2% 0px 2%',
                                                    width: 'fit-content',
                                                    float: 'left',
                                                }}
                                            >
                                                <VisibilityOffIcon fontSize="inherit" />
                                                <Typography
                                                    style={{
                                                        // display: 'flex',
                                                        fontSize: '12px',
                                                    }}
                                                    variant="subtitle2"
                                                    component="div"
                                                >
                                                    &nbsp; מוסתר
                                                </Typography>
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: '2em',
                                                    background: '#7aec93cc',
                                                    padding: '0px 2% 0px 2%',
                                                    width: 'fit-content',
                                                    float: 'left',
                                                }}
                                            >
                                                <VisibilityOutlinedIcon fontSize="inherit" />
                                                <Typography
                                                    style={{
                                                        fontSize: '12px',
                                                    }}
                                                    variant="subtitle2"
                                                    component="div"
                                                >
                                                    &nbsp; גלוי
                                                </Typography>
                                            </div>
                                        )}
                                        <div style={{ opacity: `${note.hidden ? '0.65' : '1'}` }}>
                                            <h3 className="vertical-timeline-element-title">{note.title}</h3>
                                            <h5 className="vertical-timeline-element-subtitle">{note.subtitle}</h5>
                                            <p id="description" style={{ wordBreak: 'break-word' }}>
                                                {note.description}
                                            </p>
                                            <p id="description">
                                                נכתב על ידי <strong>{(note.createdBy as IUser).fullName}</strong>
                                            </p>

                                            {state.user?._id === (note.createdBy as IUser)._id && (
                                                <>
                                                    <IconButton
                                                        style={{ width: '15%', float: 'right', borderRadius: '10px' }}
                                                        aria-label="edit"
                                                        size="medium"
                                                        onClick={() => handleFormOpen(note)}
                                                    >
                                                        <EditIcon fontSize="inherit" />
                                                    </IconButton>
                                                    <IconButton
                                                        style={{ width: '15%', float: 'left', borderRadius: '10px' }}
                                                        aria-label="delete"
                                                        size="medium"
                                                        onClick={() => handleClickOpen(note)}
                                                    >
                                                        <DeleteIcon fontSize="inherit" />
                                                    </IconButton>
                                                </>
                                            )}
                                        </div>
                                    </VerticalTimelineElement>
                                );
                            })}
                        </VerticalTimeline>
                    </Grid>
                ) : (
                    <EmptyContentComp
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        label="פתקים"
                    />
                )}
                <Grid item xs={2} />
            </Grid>
        </div>
    );
};

export default NotesTimeline;
