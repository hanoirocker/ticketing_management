import express, { Request, Response } from 'express';
// We'll use express-validator for validating body params for creating the user
import { body, validationResult } from 'express-validator'; // checks the body of an incomming request
import jwt from 'jsonwebtoken'; // for creating JWT tokens

import { User } from '../models/user';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';

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

    // If no errors found ...

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError(
        'Already existing user using the email provided'
      );
    }

    // If no user found using the given email
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT token for the user
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      'asdf' // TODO: replace later
    );

    // Define the req.session object and store the user JWT token in it
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
