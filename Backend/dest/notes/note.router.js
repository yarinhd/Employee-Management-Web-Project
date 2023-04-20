"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRouter = void 0;
const express_1 = require("express");
const utils_1 = require("../utils/AuthenticationJWT/lib/utils");
const validationMW_1 = require("../utils/validations/validationMW");
const wrapper_1 = __importDefault(require("../wrapper"));
const note_controller_1 = __importDefault(require("./note.controller"));
exports.noteRouter = (0, express_1.Router)();
// get all Notes of user by username query
exports.noteRouter.get('/', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetAllNote), wrapper_1.default.wrapAsync(note_controller_1.default.getAllUserNotes));
exports.noteRouter.get('/myProfile/', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetAllNote), wrapper_1.default.wrapAsync(note_controller_1.default.getAllSelfNotes));
// get Note by noteId
exports.noteRouter.get('/:noteId', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canGetNote), wrapper_1.default.wrapAsync(note_controller_1.default.getNotePopulatedById));
// create Note by request body
exports.noteRouter.post('/:userId', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canCreateNote), wrapper_1.default.wrapAsync(note_controller_1.default.createNote));
// update Note by noteId
exports.noteRouter.put('/:noteId', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canUpdateDeleteNote), wrapper_1.default.wrapAsync(note_controller_1.default.updateNoteById));
// delete Note by noteId
exports.noteRouter.delete('/:noteId', utils_1.AuthMiddleware, wrapper_1.default.wrapAsync(validationMW_1.Validator.canUpdateDeleteNote), wrapper_1.default.wrapAsync(note_controller_1.default.deleteNoteById));
