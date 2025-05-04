"use strict";
// This class makes it possible for the middleware 'errorHandler' to
// easily deal with any type of error class that extends this one (DatabaseConnectionError, etc ..)
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message) {
        super(message);
        // Since Error is built in language and we're extending from it,
        // we need to do the following:
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
