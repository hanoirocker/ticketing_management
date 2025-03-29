import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authroized-error';

// This middleware is used to check if the user is authenticated. It checks if
// the req.currentUser object is defined. If it is not defined, it throws a
// NotAuthorizedError.
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
};
