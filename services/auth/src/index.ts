import mongoose from 'mongoose';

import { app } from './app';

/**
 * Connect to MongoDB cluster ip using mongoose and start listeting on app port after it.
 *
 * 'mongodb' - needed when using mongoose
 * 'auth-mongo-srv' - metadata/name of the service to connect to.
 * ':27017' - cluster ip defined port.
 * 'auth' - name for the database to create (could be anything actually)
 */
const start = async () => {
  // signing key for validating the token. Retrieved from env variables as secret key
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Auth service Listening on port 3000');
  });
};

start();
