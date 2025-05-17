import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest } from '@hanoiorg/ticketing_common';
import { BadRequestError } from '@hanoiorg/ticketing_common';

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
  async (req: Request, res: Response) => {
    console.log('Trying to sign in user!');

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email }); // query the DB for the user
    if (!existingUser) {
      throw new BadRequestError('Email not found');
    }

    // If user found, check if the password is correct
    const passWordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passWordsMatch) {
      throw new BadRequestError('Password not found or incorrect');
    }

    // if user exists and password provided is correct, generate a JWT token
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser); // 200 since user is not new (not new data inside of DB)
  }
);

export { router as signinRouter };
