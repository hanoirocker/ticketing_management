"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthorizedError = void 0;
const custom_error_1 = require("./custom-error");
// Generic not authorized error that recieves a string as message for multiple error
// cases. This error is used when a user tries to access a resource that they are not
// authorized to access.
class NotAuthorizedError extends custom_error_1.CustomError {
    constructor() {
        super('Not authorized :$');
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Not authorized :$' }];
    }
}
exports.NotAuthorizedError = NotAuthorizedError;
