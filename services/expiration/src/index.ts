import { natsWrapper } from './nats-wrapper';

/**
 * As we're not waiting any http request or running mongoose on this app,
 * we'll only need some NATS variables and event listeners
 */
const start = async () => {
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
  } catch (err) {
    console.error(err);
  }
};

start();
