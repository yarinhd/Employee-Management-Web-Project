import utf8 from 'utf8';
import { getHeaders, handleErrors, json } from './helpers';
import config from '../config';
import IUser from '../models/IUser';
import { IDocument } from '../models/IDocument';
import INote from '../models/INote';

interface IAuth {
    message: string;
    date: Date;
    dateEx: Date;
    user: IUser;
}

const userApi = config.endpoints.user.api;
const authApi = config.endpoints.auth.api;
const documentApi = config.endpoints.document.api;
const noteApi = config.endpoints.note.api;

console.log('api', userApi);
// eslint-disable-next-line import/prefer-default-export
export const getMyUser: () => Promise<IUser> = () => {
    return fetch(`${userApi}/me`, {
        headers: getHeaders(),
    })
        .then(handleErrors)
        .then(json);
};

export const getUser: (userId: string) => Promise<IUser> = (userId: string) => {
    console.log(`${userApi}/${userId}`);

    return fetch(`${userApi}/${userId}`, {
        credentials: 'include',
        headers: getHeaders(),
    })
        .then(handleErrors)
        .then(json);
};

export const setMyUserCookie: () => Promise<IAuth> = () => {
    console.log(authApi);

    return fetch(`${authApi}`, {
        credentials: 'include',
        headers: getHeaders(),
    })
        .then(handleErrors)
        .then(json);
};

export const getMyPakoodim: () => Promise<IUser[]> = () => {
    console.log(`${userApi}/MyPakoodim`);
    return fetch(`${userApi}/MyPakoodim`, {
        credentials: 'include',
        headers: getHeaders(),
    })
        .then(handleErrors)
        .then(json);
};

export const uploadDocument: (userId: string, subject: string, hidden: boolean, file: File) => Promise<IDocument> = (
    userId: string,
    subject: string,
    hidden: boolean,
    file: File
) => {
    const formData = new FormData();
    console.log('userId', userId);

    console.log('file', file);

    formData.append('upload', file, file.name);
    formData.append('subject', subject);
    formData.append('hidden', String(hidden));

    console.log('formData:', formData);
    // eslint-disable-next-line no-restricted-syntax
    for (const key of formData.entries()) {
        console.log(`${key[0]}, ${key[1]}`);
    }

    console.log(`${documentApi}/${userId}`);

    return fetch(`${documentApi}/${userId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
        .then(handleErrors)
        .then(json);
};

export const downloadDocument: (documentId: string) => Promise<string> = (documentId: string) => {
    console.log(`${documentApi}/download/${documentId}`);

    return fetch(`${documentApi}/download/${documentId}`, {
        credentials: 'include',
        headers: {
            Accept: 'application/octet-stream',
            ContentType: 'application/json',
        },
    })
        .then(handleErrors)
        .then((response) => {
            const fileName = response.headers.get('Content-Disposition').split('filename=')[1].split(';')[0] as string;

            response.blob().then((blob: Blob) => {
                const a = document.createElement('a');
                a.href = window.URL.createObjectURL(blob);
                document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox

                a.download = utf8.decode(fileName);
                a.click();
                a.remove();

                return fileName;
            });
            return fileName;
        });
};

export const getUserDocsBySub: (userId: string, subject: string, connectedUserId: string) => Promise<IDocument[]> = (
    userId: string,
    subject: string,
    connectedUserId: string
) => {
    console.log(`${documentApi}/?${new URLSearchParams({ userId, subject })}`);
    if (userId !== connectedUserId) {
        return fetch(`${documentApi}/?${new URLSearchParams({ userId, subject })}`, {
            credentials: 'include',
            headers: getHeaders(),
        })
            .then(handleErrors)
            .then(json);
    }
    console.log(`${documentApi}/myProfile/?${new URLSearchParams({ userId, subject })}`);

    return fetch(`${documentApi}/myProfile/?${new URLSearchParams({ userId, subject })}`, {
        credentials: 'include',
        headers: getHeaders(),
    })
        .then(handleErrors)
        .then(json);
};

export const updateDocument: (documentId: string, documentData: Partial<IDocument>) => Promise<IDocument> = (
    documentId: string,
    documentData: Partial<IDocument>
) => {
    console.log(`${documentApi}/${documentId}`);

    return fetch(`${documentApi}/${documentId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify(documentData),
    })
        .then(handleErrors)
        .then(json);
};

export const deleteDocument: (documentId: string) => Promise<IDocument[]> = (documentId: string) => {
    console.log(`${documentApi}/${documentId}`);

    return fetch(`${documentApi}/${documentId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getHeaders(),
    })
        .then(handleErrors)
        .then(json);
};

export const createNote: (noteData: INote) => Promise<INote> = (noteData: INote) => {
    console.log(`${noteApi}/${noteData.userId}`);

    return fetch(`${noteApi}/${noteData.userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify(noteData),
    })
        .then(handleErrors)
        .then(json);
};

export const getAllUserNotes: (userId: string, connectedUserId: string) => Promise<INote[]> = (
    userId: string,
    connectedUserId: string
) => {
    console.log(`${noteApi}/?${new URLSearchParams({ userId })}`);
    if (userId !== connectedUserId) {
        return fetch(`${noteApi}/?${new URLSearchParams({ userId })}`, {
            credentials: 'include',
            headers: getHeaders(),
        })
            .then(handleErrors)
            .then(json);
    }
    return fetch(`${noteApi}/myProfile/?${new URLSearchParams({ userId })}`, {
        credentials: 'include',
        headers: getHeaders(),
    })
        .then(handleErrors)
        .then(json);
};

export const deleteNote: (noteId: string) => Promise<INote[]> = (noteId: string) => {
    console.log(`${noteApi}/${noteId}`);

    return fetch(`${noteApi}/${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getHeaders(),
    })
        .then(handleErrors)
        .then(json);
};

export const updateNote: (noteData: Partial<INote>) => Promise<INote> = (noteData: Partial<INote>) => {
    console.log(`${noteApi}/${noteData._id}`);

    return fetch(`${noteApi}/${noteData._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: getHeaders(),
        body: JSON.stringify(noteData),
    })
        .then(handleErrors)
        .then(json);
};

export const createBranch: (branchName: string) => Promise<IUser[]> = (branchName: string) => {
    console.log(`${userApi}/upsertBranch/${branchName}`);

    return fetch(`${userApi}/upsertBranch/${branchName}`, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(),
    })
        .then(handleErrors)
        .then(json);
};
