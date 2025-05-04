import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// Modify the Request interface to include the currentUser property
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// Middleware for getting the current user to be used on multiple services in our
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }
  // If the JWT token exists, we will decode it using the JWT_KEY
  try {
    const payload = jwt.verify(
      req.session?.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    // NOTE: req type definition had to be modified above to include currentUser!!
    req.currentUser = payload; // Add the payload to the request object.
  } catch (err) {
    res.send({ currentUser: null });
  }

  // Wheter or not the JWT token exists, we will call the next middleware
  next();
};
