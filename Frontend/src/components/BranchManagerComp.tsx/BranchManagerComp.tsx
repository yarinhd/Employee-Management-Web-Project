/* eslint-disable prettier/prettier */
import { makeStyles, Typography, Button } from '@material-ui/core';
import React, { useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import UpdateIcon from '@mui/icons-material/Update';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';
import { Context } from '../../store/Store';
import useWrapFetch from '../../hooks/useWrapFetch';
import { createBranch } from '../../services/user';
import IUser from '../../models/IUser';
import toastHandler from '../../Utils/toastHandler';

const useStyle = makeStyles({
    root: {
        '&.MuiButton-root': {
            width: '100%',
        },
        '&.MuiDialogActions-root': {
            display: 'flex',
            justifyContent: 'space-evenly',
            borderRadius: '4px',
            background: 'linear-gradient(0deg, #5AB9EA 0%, #84CEEB 50%, #5AB9EA 100%)',
        },
    },
    boldText: {
        fontWeight: 500,
        fontSize: '1.2em',
    },
    regularText: {
        fontWeight: 400,
        color: 'black',
        fontSize: '1.1em',
        whiteSpace: 'pre-line',
    },
});

const BranchManagerComp: React.FC = () => {
    const classes = useStyle();
    const [state, dispatch] = useContext(Context);
    const [openBranchActions, setOpenBranchActions] = React.useState<boolean>(false);

    const createBranchWrapped = useWrapFetch(createBranch);

    const handleCloseBranchActions = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpenBranchActions(false);
    };

    const handleOpenBranchActions = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpenBranchActions(true);
    };

    const handleCreateBranch = (e: React.MouseEvent<HTMLButtonElement>) => {
        createBranchWrapped(state.user?.inGroup)((allBranchUsers: IUser[]) => {
            dispatch({ type: 'SET_PAKOODIM', payload: allBranchUsers });
        });
        toastHandler('success', `אתחול/עדכון ענף ${state.user?.inGroup} בוצע בהצלחה!`);

        setOpenBranchActions(false);
    };
    return (
        <>
            <Button
                variant="outlined"
                onClick={handleOpenBranchActions}
                endIcon={<AddCircleOutlineIcon fontSize="large" />}
            >
                <Typography variant="h6" component="span">
                    אתחול/עדכון המערכת
                </Typography>
            </Button>
            <Dialog
                open={openBranchActions}
                onClose={handleCloseBranchActions}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    style={{ background: 'linear-gradient(0deg, #5AB9EA 0%, #84CEEB 50%, #5AB9EA 100%)' }}
                >
                    <Typography component="span" className={classes.boldText}>
                        פעולות ענפיות
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography component="span" className={classes.regularText}>
                            ברוך הבא! {'\n\n'}
                            הינך עומד ליצור/לעדכן את הענף.{'\n\n'}
                            במידה והענף לא נוצר - כלל המדורים והצוותים יאותחלו בהתאם לנתונים השמורים עליהם במערך.{' '}
                            {'\n\n'}
                            במידה והענף קיים - כלל הנתונים יתעדכנו הן בפרטים האישיים והן במדורים ובצוותים.{'\n'}
                            {'\n\n'}
                            <Box component="span" fontWeight="fontWeightMedium" display="inline">
                                חשוב לציין - לאחר יצירת הענף מתבצע עדכון בעת הלחיצה.
                            </Box>
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions className={classes.root}>
                    <Button
                        autoFocus
                        onClick={handleCreateBranch}
                        className={classes.root}
                        style={{ border: '1px solid black' }}
                        endIcon={<GroupAddIcon fontSize="large" />}
                    >
                        <Typography variant="h6" component="span">
                            צור/עדכן ענף
                        </Typography>
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BranchManagerComp;
