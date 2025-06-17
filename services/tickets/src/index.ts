import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';

import { app } from './app';

// TODO: UPDATE THIS

/**
 * Connect to MongoDB cluster ip using mongoose and start listeting on app port after it.
 *
 * 'mongodb' - needed when using mongoose
 * 'tickets-mongo-srv' - metadata/name of the service to connect to.
 * ':27017' - cluster ip defined port.
 * 'tickets' - name for the database to create (could be anything actually)
 */
const start = async () => {
  // signing key for validating the token. Retrieved from env variables as secret key
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  // check if mongodb URI is defined at infra depl file
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await natsWrapper.connect('ticketing', 'jelska', 'http://nats-srv:4222');

    // Watches for close events from NATS, to be receieved after any interrumption or
    // termination signal is intercepted
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      // Kill the program if client is down
      process.exit();
    });
    // Set listeners for interrupt or termination signals. If any of those are intercepted,
    // we tell NATS to termine the connection
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Tickets service Listening on port 3000');
  });
};

start();
