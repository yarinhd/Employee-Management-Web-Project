import INote from './note.interface';
import NoteModel from './note.model';

export default class NoteRepository {
    static async getAllUserNotes(userId: string, connectedUserId: string): Promise<INote[] | null> {
        console.log('not my self page');

        const notPublicUserNotes: INote[] | null = await NoteModel.find({
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

        const publicUserNotes: INote[] | null = await NoteModel.find({
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

        if (!publicUserNotes || !notPublicUserNotes) return null;

        return notPublicUserNotes.concat(publicUserNotes);
    }

    static getAllSelfNotes(userId: string): Promise<INote[] | null> {
        const foundNotes: Promise<INote[] | null> = NoteModel.find({ userId, hidden: false })
            .populate([
                {
                    path: 'createdBy',
                    model: 'User',
                },
            ])
            .exec();

        return foundNotes;
    }

    static async createNote(newNote: INote): Promise<INote | null> {
        console.log(newNote);

        let addedNote: INote | null = await NoteModel.create(newNote);
        addedNote = await this.getNotePopulatedById(addedNote._id as string);
        return addedNote;
    }

    static getNotePopulatedById(noteId: string): Promise<INote | null> {
        const foundNote: Promise<INote | null> = NoteModel.findById(noteId)
            .populate([
                {
                    path: 'createdBy',
                    model: 'User',
                },
            ])
            .exec();
        return foundNote;
    }

    static getNoteById(noteId: string): Promise<INote | null> {
        const foundNote: Promise<INote | null> = NoteModel.findById(noteId).exec();
        return foundNote;
    }

    static updateNoteById(noteId: string, noteData: Partial<INote>): Promise<INote | null> {
        console.log(`noteData before repository: ${noteData}`);

        const updatedNote: Promise<INote | null> = NoteModel.findByIdAndUpdate(noteId, noteData, { new: true })
            .populate([
                {
                    path: 'createdBy',
                    model: 'User',
                },
            ])
            .exec();
        return updatedNote;
    }

    static deletedNoteById(noteId: string): Promise<INote | null> {
        const deletedNote: Promise<INote | null> = NoteModel.findByIdAndDelete(noteId).exec();
        return deletedNote;
    }
}
