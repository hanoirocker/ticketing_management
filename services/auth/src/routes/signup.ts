import express, { Request, Response } from 'express';
// We'll use express-validator for validating body params for creating the user
import { body, validationResult } from 'express-validator'; // checks the body of an incomming request
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must have a valid format :$'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    console.log('Trying to create new user ....');
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signupRouter };
