import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log(`Listener with clientId ${clientId} connencted to NATS SS`);
  console.log(`Process ${process.pid}`);

  // Watches for close events from NATS, to be receieved after any interrumption or
  // termination signal is intercepted
  stan.on('close', () => {
    console.log('NATS connection closed');
    // Kill the program if client is down
    process.exit();
  });

  /**
   * To set options, we need to call each method as chain after `subscriptionOptions`
   *
   * - setMnualAckMode(true): stops the default 'everything is ok onced msg is received' behaviour.
   * Thisway, we can process msg and let NATS know everthing is fine once we sucessfuly
   * madewhat we wanted with it. If after 30 secs NATS hasn't received any confirmation,
   * the msg will be sent to any other member of the queue group
   * - setDeliverAllAvailable(): makes it possible for retreving all events processed in the past
   * in case the service goes down. This is run only one time as the services goes up.
   * - setDurableName(): makes it possible to return only not processed sucesfully events,
   * so we don't retrieve ALL events after a service goes down.
   */
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('orders-service');

  // Set up channel for listening to and queue name
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Recieved event #${msg.getSequence()}, with data: ${data}`);
    }

    // Let's NATS know event has been processed correctly.
    msg.ack();
  });
});

// Watches for interrupt or termination signals. If any of those are intercepted,
// we tell NATS to not send any more messages into this client
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
