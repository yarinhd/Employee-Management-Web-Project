import { Request, Response } from 'express';
import { IUser } from '../users/user.interface';
import INote from './note.interface';
import NoteManager from './note.manager';

export default class NoteController {
    static async getNotePopulatedById(req: Request, res: Response) {
        // const userAuth: IUser = req.user! as IUser;
        const { noteId } = req.params;
        const noteFound = await NoteManager.getNotePopulatedById(noteId);
        res.status(200).json(noteFound);
    }

    static async getAllUserNotes(req: Request, res: Response) {
        const loggedUser = (req.user! as IUser)._id as string;
        const userId = req.query.userId as string;
        const foundNotes: INote[] = await NoteManager.getAllUserNotes(userId, loggedUser);
        res.json(foundNotes);
    }

    static async getAllSelfNotes(req: Request, res: Response) {
        const userId = req.query.userId as string;

        const foundNotes: INote[] = await NoteManager.getAllSelfNotes(userId);
        res.json(foundNotes);
    }

    static async createNote(req: Request, res: Response) {
        const newNote: INote = req.body as INote;
        const addedNote = await NoteManager.createNote(newNote);
        res.status(200).json(addedNote);
    }

    static async updateNoteById(req: Request, res: Response) {
        const { noteId } = req.params;
        const noteData = req.body as Partial<INote>;
        console.log('noteData update:', noteData);

        const updatedNote = await NoteManager.updateNoteById(noteId, noteData);
        console.log(updatedNote);

        res.status(200).json(updatedNote);
    }

    static async deleteNoteById(req: Request, res: Response) {
        const { noteId } = req.params;
        const deletedNote = await NoteManager.deletedNoteById(noteId);
        res.status(200).json(deletedNote);
    }
}
