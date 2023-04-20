export class UserError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
    }
}

export class UserNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'User not found', 404);
    }
}

export class GroupNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'Group not found', 404);
    }
}

export class NoteNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'Group not found', 404);
    }
}

export class DocumentNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'Document not found', 404);
    }
}

export class SubjectNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'Subject not found', 404);
    }
}

export class DuplicatedUserError extends UserError {
    constructor(message: string) {
        super(message || `A group can't have duplicated participants/groups values`, 400);
    }
}

export class WrongFilePathError extends UserError {
    constructor(message: string) {
        super(message || `failed to delete the uploaded file from the hard disk`, 404);
    }
}

export class DuplicationUser extends UserError {
    constructor(message: string) {
        super(message || `User is already exist in the database!`, 404);
    }
}

export class WrongInputSubjectError extends UserError {
    constructor(message: string) {
        super(message || 'Subject is not exist - choose option from the box', 404);
    }
}

export class FileNotUploadedError extends UserError {
    constructor(message: string) {
        super(message || 'File not uploaded', 400);
    }
}

export class WrongFilterInputError extends UserError {
    constructor(message: string) {
        super(message || 'More than one filter sent', 400);
    }
}

export class UnAuthorizedError extends UserError {
    constructor(message: string) {
        super(message || 'User Unauthorized', 403);
    }
}

export class FileNameNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'can not delete because worng filename', 403);
    }
}

export class UserWithoutGroupError extends UserError {
    constructor(message: string) {
        super(message || 'user dont have group!', 403);
    }
}
export class MissingParamsError extends UserError {
    constructor(message: string) {
        super(message || 'Missing params', 401);
    }
}

export class BranchManagerNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'Branch manager not found!', 401);
    }
}

export class MadorManagerNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'Mador manager not found!', 401);
    }
}

export class TeamManagerNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'Team manager not found!', 401);
    }
}

export class TeamUsersNotFoundError extends UserError {
    constructor(message: string) {
        super(message || 'There is no users at all inside teams!', 401);
    }
}

export class UserIsNotConnectedError extends UserError {
    constructor(message: string) {
        super(message || 'User is not connected!', 401);
    }
}

export class LackOfUserInfoError extends UserError {
    constructor(message: string) {
        super(message || 'User is missing critical fields!', 401);
    }
}

export class BranchCreationError extends UserError {
    constructor(message: string) {
        super(message || 'Failed to create branch', 401);
    }
}

export class BranchUpdateError extends UserError {
    constructor(message: string) {
        super(message || 'Failed to update branch', 401);
    }
}
