import { captureRejectionSymbol } from 'events';
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// This route will be used to get the current user JWT if exists,
// for our React app to verify if the user is logged in or not
router.get('/api/users/currentuser', (req, res) => {
  console.log('Getting current user!');

  if (!req.session?.jwt) {
    res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session?.jwt, process.env.JWT_KEY!);
    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
