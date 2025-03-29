import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest, // This middleware will check for validation errors and throw an error if any are found
  (req: Request, res: Response) => {
    console.log('Trying to sign in user!');
  }
);

export { router as signinRouter };
