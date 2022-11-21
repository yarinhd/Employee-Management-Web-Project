import IUser from './IUser';

export enum DocumentSubject {
    PA = 'פ"א',
    HATAH = 'שיחת חתך',
    HAVAD = 'חוו"ד מפקדים',
    SIKUM_PROJECT = 'סיכום פרויקטים',
}

export interface IDocument {
    _id?: string;
    subject: DocumentSubject;
    hidden: boolean;
    createdBy: string | IUser;
    fileName: string | null;
    userId: string | IUser;
    createdAt?: string;
    updatedAt?: string;
}
