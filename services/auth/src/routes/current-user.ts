import express from 'express';

import { requireAuth } from '../middlewares/require-auth';
import { currentUser } from '../middlewares/current-user';

const router = express.Router();

// This route will be used to get the current user JWT if exists,
// for our React app to verify if the user is logged in or not
router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  console.log('Getting current user!');
  const { currentUser } = req; // This will be the payload we added in the currentUser middleware
  res.send(currentUser || null); // If currentUser is not defined, send null
});

export { router as currentUserRouter };
