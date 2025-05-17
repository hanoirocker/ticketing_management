import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

// The idea of thsi middleware is to:
// - Catch every error found on requests
// - Return a solid structure for those errors

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  // If case is not defined as a CustomError, let's log some data
  // fot the user to know what could be wrong!
  console.log(err);
  res.status(400).send({
    errors: [{ message: 'Alternative error :(' }],
  });
};
