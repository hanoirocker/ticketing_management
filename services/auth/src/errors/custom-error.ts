// This class makes it possible for the middleware 'errorHandler' to
// easily deal with any type of error class that extends this one (DatabaseConnectionError, etc ..)

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    // Since Error is built in language and we're extending from it,
    // we need to do the following:
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
