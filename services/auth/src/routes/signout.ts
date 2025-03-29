import express from 'express';
import cookieSession from 'cookie-session';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  console.log('Trying to sign out!');

  req.session = null; // This will remove the JWT token from the session
  res.send({}); // Send an empty response
});

export { router as signoutRouter };
