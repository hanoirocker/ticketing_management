"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
const custom_error_1 = require("./custom-error");
class RequestValidationError extends custom_error_1.CustomError {
    constructor(errors) {
        super('Invalid request parameters!');
        this.errors = errors;
        this.statusCode = 400;
        // Since Error is built in language and we're extending from it,
        // we need to do the following:
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }
    // Build the error structure based on the list of RequestValidationError objects received.
    // This means mapping each object and building a new object 'errors' which will
    // be a list of objects with 'messsage' and 'field' keys.
    serializeErrors() {
        return this.errors.map((err) => {
            if (err.type === 'field') {
                return { message: err.msg, field: err.path };
            }
            return { message: err.msg };
        });
    }
}
exports.RequestValidationError = RequestValidationError;
