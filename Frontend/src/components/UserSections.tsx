import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FileUploadProps, DocumentsComp } from '../UploadComp/DocumentsComp';
import NotesTimeline from './NotesTimeline/NotesTimeLine';

const UserSections = () => {
    const fileUploadProp: FileUploadProps = {
        title: 'שיחות פא',
        subject: String('פ"א'),
        accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    const fileUploaddProp: FileUploadProps = {
        title: 'שיחות חתך',
        subject: String('שיחות חתך'),
        accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    const fileUploadddProp: FileUploadProps = {
        title: 'חווד מפקדים',
        subject: String('חוו"ד מפקדים'),
        accept: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };
    return (
        <div>
            <Accordion>
                <AccordionSummary
                    style={{ background: 'linear-gradient(0deg, #ffffff 0%,#5AB9EA 50%)' }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={{ fontWeight: 'medium' }}>שיחות פא</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DocumentsComp {...fileUploadProp} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    style={{ background: 'linear-gradient(0deg, #ffffff 0%,#5AB9EA 50%)' }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={{ fontWeight: 'medium' }}>שיחות חתך</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DocumentsComp {...fileUploaddProp} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    style={{ background: 'linear-gradient(0deg, #ffffff 0%,#5AB9EA 50%)' }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={{ fontWeight: 'medium' }}>חווד מפקדים</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <DocumentsComp {...fileUploadddProp} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    style={{ background: 'linear-gradient(0deg, #ffffff 0%,#5AB9EA 50%)' }}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={{ fontWeight: 'medium' }}>הערות אישיות</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <NotesTimeline />
                </AccordionDetails>
            </Accordion>
        </div>
    );
};

export default UserSections;
