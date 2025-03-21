import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters!');

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
