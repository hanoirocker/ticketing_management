import express, { Request, Response } from 'express';
// We'll use express-validator for validating body params for creating the user
import { body } from 'express-validator'; // checks the body of an incomming request
import jwt from 'jsonwebtoken'; // for creating JWT tokens

import { validateRequest } from '@hanoiorg/ticketing_common';
import { User } from '../models/user';
import { BadRequestError } from '@hanoiorg/ticketing_common';

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
  validateRequest, // This middleware will check for validation errors and throw an error if any are found
  async (req: Request, res: Response) => {
    console.log('Trying to sign up user!');

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
      process.env.JWT_KEY! // '!' to calm down TS error message. This is already verified in index.ts
    );

    // Define the req.session object and store the user JWT token in it
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
