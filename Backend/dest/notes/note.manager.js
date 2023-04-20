"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_manager_1 = __importDefault(require("../users/user.manager"));
const userError_1 = require("../utils/errors/userError");
const note_repository_1 = __importDefault(require("./note.repository"));
class NoteManager {
    /**
     * @param {string} userId user Id as PK
     * @param {string} userAuth logged user Id as PK
     * @return {INote} all notes which related to userId
     */
    static async getAllUserNotes(userId, connectedUserId) {
        const foundNotes = await note_repository_1.default.getAllUserNotes(userId, connectedUserId);
        if (!foundNotes) {
            throw new userError_1.NoteNotFoundError('Note not found -  failed while finding notes');
        }
        console.log(foundNotes);
        return foundNotes;
    }
    static async getAllSelfNotes(userId) {
        const foundNotes = await note_repository_1.default.getAllSelfNotes(userId);
        if (!foundNotes) {
            throw new userError_1.NoteNotFoundError('Note not found -  failed while finding notes');
        }
        return foundNotes;
    }
    /**
     * @param {Partial<INote>} newNote data of new Note
     * @return {INote} created note based on newNote data
     */
    static async createNote(newNote) {
        await user_manager_1.default.getUserByUserId(newNote.userId);
        const addedNote = await note_repository_1.default.createNote(newNote);
        if (!addedNote) {
            throw new userError_1.NoteNotFoundError('Note not found - failed to create note');
        }
        return addedNote;
    }
    /**
     * @param {string} noteId user Id as PK
     * @return {INote} found note based on noteId populated
     */
    static async getNotePopulatedById(noteId) {
        const foundNote = await note_repository_1.default.getNotePopulatedById(noteId);
        if (!foundNote) {
            throw new userError_1.NoteNotFoundError('Note not found -  failed while finding notes');
        }
        return foundNote;
    }
    /**
     * @param {string} noteId user Id as PK
     * @return {INote} found note based on noteId
     */
    static async getNoteById(noteId) {
        const foundNote = await note_repository_1.default.getNoteById(noteId);
        if (!foundNote) {
            throw new userError_1.NoteNotFoundError('Note not found -  failed while finding notes');
        }
        return foundNote;
    }
    /**
     * @param {string} noteId user Id as PK
     * @param {Partial<INote>} noteData new INote data
     * @return {INote} updated note based on note data
     */
    static async updateNoteById(noteId, noteData) {
        const updatedNote = await note_repository_1.default.updateNoteById(noteId, noteData);
        if (!updatedNote) {
            throw new userError_1.NoteNotFoundError('Note failed to update - failed while updating note');
        }
        return updatedNote;
    }
    /**
     * @param {string} noteId user Id as PK
     * @return {INote} deleted note based on note data
     */
    static async deletedNoteById(noteId) {
        const deletedNote = await note_repository_1.default.deletedNoteById(noteId);
        if (!deletedNote) {
            throw new userError_1.NoteNotFoundError("Note not found - couldn't delete note");
        }
        return deletedNote;
    }
}
exports.default = NoteManager;
