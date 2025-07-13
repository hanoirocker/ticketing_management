import mongoose from 'mongoose';
import { natsWrapper } from './nats-wrapper';

import { app } from './app';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

/**
 * Connect to MongoDB cluster ip using mongoose and start listeting on app port after it.
 *
 * 'mongodb' - needed when using mongoose
 * 'tickets-mongo-srv' - metadata/name of the service to connect to.
 * ':27017' - cluster ip defined port.
 * 'tickets' - name for the database to create (could be anything actually)
 */
const start = async () => {
  console.log('Starting payments service ..');
  // signing key for validating the token. Retrieved from env variables as secret key
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }

  // check if mongodb URI is defined at infra depl file
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  // check if NATS_URL is defined at infra depl file
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }

  // check if NATS_CLUSTER_ID is defined at infra depl file
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  // check if NATS_CLIENT_ID is defined at infra depl file.
  // Note: this value is generated from the pod name itself, for easier debugging
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

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

    // Instantiate listeners and put them to listen
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Payments service Listening on port 3000');
  });
};

start();
