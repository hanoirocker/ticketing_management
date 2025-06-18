import { CustomError } from './custom-error';

// Generic not authorized error that recieves a string as message for multiple error
// cases. This error is used when a user tries to access a resource that they are not
// authorized to access.
export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
