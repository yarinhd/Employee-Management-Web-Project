import UserManager from '../users/user.manager';
import { NoteNotFoundError } from '../utils/errors/userError';
import INote from './note.interface';
import NoteRepository from './note.repository';

export default class NoteManager {
    /**
     * @param {string} userId user Id as PK
     * @param {string} userAuth logged user Id as PK
     * @return {INote} all notes which related to userId
     */
    static async getAllUserNotes(userId: string, connectedUserId: string): Promise<INote[]> {
        const foundNotes: INote[] | null = await NoteRepository.getAllUserNotes(userId, connectedUserId);
        if (!foundNotes) {
            throw new NoteNotFoundError('Note not found -  failed while finding notes');
        }
        console.log(foundNotes);

        return foundNotes;
    }

    static async getAllSelfNotes(userId: string): Promise<INote[]> {
        const foundNotes: INote[] | null = await NoteRepository.getAllSelfNotes(userId);
        if (!foundNotes) {
            throw new NoteNotFoundError('Note not found -  failed while finding notes');
        }

        return foundNotes;
    }

    /**
     * @param {Partial<INote>} newNote data of new Note
     * @return {INote} created note based on newNote data
     */
    static async createNote(newNote: INote) {
        await UserManager.getUserByUserId(newNote.userId as string);
        const addedNote = await NoteRepository.createNote(newNote);
        if (!addedNote) {
            throw new NoteNotFoundError('Note not found - failed to create note');
        }
        return addedNote;
    }

    /**
     * @param {string} noteId user Id as PK
     * @return {INote} found note based on noteId populated
     */
    static async getNotePopulatedById(noteId: string) {
        const foundNote = await NoteRepository.getNotePopulatedById(noteId);
        if (!foundNote) {
            throw new NoteNotFoundError('Note not found -  failed while finding notes');
        }
        return foundNote;
    }

    /**
     * @param {string} noteId user Id as PK
     * @return {INote} found note based on noteId
     */
    static async getNoteById(noteId: string) {
        const foundNote = await NoteRepository.getNoteById(noteId);
        if (!foundNote) {
            throw new NoteNotFoundError('Note not found -  failed while finding notes');
        }
        return foundNote;
    }

    /**
     * @param {string} noteId user Id as PK
     * @param {Partial<INote>} noteData new INote data
     * @return {INote} updated note based on note data
     */
    static async updateNoteById(noteId: string, noteData: Partial<INote>) {
        const updatedNote = await NoteRepository.updateNoteById(noteId, noteData);
        if (!updatedNote) {
            throw new NoteNotFoundError('Note failed to update - failed while updating note');
        }
        return updatedNote;
    }

    /**
     * @param {string} noteId user Id as PK
     * @return {INote} deleted note based on note data
     */
    static async deletedNoteById(noteId: string) {
        const deletedNote = await NoteRepository.deletedNoteById(noteId);
        if (!deletedNote) {
            throw new NoteNotFoundError("Note not found - couldn't delete note");
        }
        return deletedNote;
    }
}
