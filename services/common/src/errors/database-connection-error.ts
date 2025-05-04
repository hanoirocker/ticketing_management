// This class is not super necessary since it's only returning a string value,
// but that's ok. Works as example for separating errors into different classes.

import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;
  reason = 'Error connecting to DB!';

  constructor() {
    super('Error connecting to DB!');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
