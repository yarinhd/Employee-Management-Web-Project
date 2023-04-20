"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const note_model_1 = __importDefault(require("./note.model"));
class NoteRepository {
    static async getAllUserNotes(userId, connectedUserId) {
        console.log('not my self page');
        const notPublicUserNotes = await note_model_1.default.find({
            userId,
            hidden: true,
            createdBy: connectedUserId,
        })
            .populate([
            {
                path: 'createdBy',
                model: 'User',
            },
        ])
            .exec();
        const publicUserNotes = await note_model_1.default.find({
            userId,
            hidden: false,
        })
            .populate([
            {
                path: 'createdBy',
                model: 'User',
            },
        ])
            .exec();
        if (!publicUserNotes || !notPublicUserNotes)
            return null;
        return notPublicUserNotes.concat(publicUserNotes);
    }
    static getAllSelfNotes(userId) {
        const foundNotes = note_model_1.default.find({ userId, hidden: false })
            .populate([
            {
                path: 'createdBy',
                model: 'User',
            },
        ])
            .exec();
        return foundNotes;
    }
    static async createNote(newNote) {
        console.log(newNote);
        let addedNote = await note_model_1.default.create(newNote);
        addedNote = await this.getNotePopulatedById(addedNote._id);
        return addedNote;
    }
    static getNotePopulatedById(noteId) {
        const foundNote = note_model_1.default.findById(noteId)
            .populate([
            {
                path: 'createdBy',
                model: 'User',
            },
        ])
            .exec();
        return foundNote;
    }
    static getNoteById(noteId) {
        const foundNote = note_model_1.default.findById(noteId).exec();
        return foundNote;
    }
    static updateNoteById(noteId, noteData) {
        console.log(`noteData before repository: ${noteData}`);
        const updatedNote = note_model_1.default.findByIdAndUpdate(noteId, noteData, { new: true })
            .populate([
            {
                path: 'createdBy',
                model: 'User',
            },
        ])
            .exec();
        return updatedNote;
    }
    static deletedNoteById(noteId) {
        const deletedNote = note_model_1.default.findByIdAndDelete(noteId).exec();
        return deletedNote;
    }
}
exports.default = NoteRepository;
