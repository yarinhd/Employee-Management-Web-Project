"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchUpdateError = exports.BranchCreationError = exports.LackOfUserInfoError = exports.UserIsNotConnectedError = exports.TeamUsersNotFoundError = exports.TeamManagerNotFoundError = exports.MadorManagerNotFoundError = exports.BranchManagerNotFoundError = exports.MissingParamsError = exports.UserWithoutGroupError = exports.FileNameNotFoundError = exports.UnAuthorizedError = exports.WrongFilterInputError = exports.FileNotUploadedError = exports.WrongInputSubjectError = exports.DuplicationUser = exports.WrongFilePathError = exports.DuplicatedUserError = exports.SubjectNotFoundError = exports.DocumentNotFoundError = exports.NoteNotFoundError = exports.GroupNotFoundError = exports.UserNotFoundError = exports.UserError = void 0;
class UserError extends Error {
    constructor(message, status) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
    }
}
exports.UserError = UserError;
class UserNotFoundError extends UserError {
    constructor(message) {
        super(message || 'User not found', 404);
    }
}
exports.UserNotFoundError = UserNotFoundError;
class GroupNotFoundError extends UserError {
    constructor(message) {
        super(message || 'Group not found', 404);
    }
}
exports.GroupNotFoundError = GroupNotFoundError;
class NoteNotFoundError extends UserError {
    constructor(message) {
        super(message || 'Group not found', 404);
    }
}
exports.NoteNotFoundError = NoteNotFoundError;
class DocumentNotFoundError extends UserError {
    constructor(message) {
        super(message || 'Document not found', 404);
    }
}
exports.DocumentNotFoundError = DocumentNotFoundError;
class SubjectNotFoundError extends UserError {
    constructor(message) {
        super(message || 'Subject not found', 404);
    }
}
exports.SubjectNotFoundError = SubjectNotFoundError;
class DuplicatedUserError extends UserError {
    constructor(message) {
        super(message || `A group can't have duplicated participants/groups values`, 400);
    }
}
exports.DuplicatedUserError = DuplicatedUserError;
class WrongFilePathError extends UserError {
    constructor(message) {
        super(message || `failed to delete the uploaded file from the hard disk`, 404);
    }
}
exports.WrongFilePathError = WrongFilePathError;
class DuplicationUser extends UserError {
    constructor(message) {
        super(message || `User is already exist in the database!`, 404);
    }
}
exports.DuplicationUser = DuplicationUser;
// Entered wrong subject for document document (need to chose an option from the DocumentSubject enum)
class WrongInputSubjectError extends UserError {
    constructor(message) {
        super(message || 'Subject is not exist - choose option from the box', 404);
    }
}
exports.WrongInputSubjectError = WrongInputSubjectError;
class FileNotUploadedError extends UserError {
    constructor(message) {
        super(message || 'File not uploaded', 400);
    }
}
exports.FileNotUploadedError = FileNotUploadedError;
class WrongFilterInputError extends UserError {
    constructor(message) {
        super(message || 'More than one filter sent', 400);
    }
}
exports.WrongFilterInputError = WrongFilterInputError;
class UnAuthorizedError extends UserError {
    constructor(message) {
        super(message || 'User Unauthorized', 403);
    }
}
exports.UnAuthorizedError = UnAuthorizedError;
class FileNameNotFoundError extends UserError {
    constructor(message) {
        super(message || 'can not delete because worng filename', 403);
    }
}
exports.FileNameNotFoundError = FileNameNotFoundError;
class UserWithoutGroupError extends UserError {
    constructor(message) {
        super(message || 'user dont have group!', 403);
    }
}
exports.UserWithoutGroupError = UserWithoutGroupError;
class MissingParamsError extends UserError {
    constructor(message) {
        super(message || 'Missing params', 401);
    }
}
exports.MissingParamsError = MissingParamsError;
class BranchManagerNotFoundError extends UserError {
    constructor(message) {
        super(message || 'Branch manager not found!', 401);
    }
}
exports.BranchManagerNotFoundError = BranchManagerNotFoundError;
class MadorManagerNotFoundError extends UserError {
    constructor(message) {
        super(message || 'Mador manager not found!', 401);
    }
}
exports.MadorManagerNotFoundError = MadorManagerNotFoundError;
class TeamManagerNotFoundError extends UserError {
    constructor(message) {
        super(message || 'Team manager not found!', 401);
    }
}
exports.TeamManagerNotFoundError = TeamManagerNotFoundError;
class TeamUsersNotFoundError extends UserError {
    constructor(message) {
        super(message || 'There is no users at all inside teams!', 401);
    }
}
exports.TeamUsersNotFoundError = TeamUsersNotFoundError;
class UserIsNotConnectedError extends UserError {
    constructor(message) {
        super(message || 'User is not connected!', 401);
    }
}
exports.UserIsNotConnectedError = UserIsNotConnectedError;
class LackOfUserInfoError extends UserError {
    constructor(message) {
        super(message || 'User is missing critical fields!', 401);
    }
}
exports.LackOfUserInfoError = LackOfUserInfoError;
class BranchCreationError extends UserError {
    constructor(message) {
        super(message || 'Failed to create branch', 401);
    }
}
exports.BranchCreationError = BranchCreationError;
class BranchUpdateError extends UserError {
    constructor(message) {
        super(message || 'Failed to update branch', 401);
    }
}
exports.BranchUpdateError = BranchUpdateError;
