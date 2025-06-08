import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const clientId = randomBytes(4).toString('hex');

const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log(`Listener with clientId ${clientId} connencted to NATS SS`);

  // To set options, we need to call each method as chain after `subscriptionOptions`
  // setManualAckMode(true): stops the default 'everything is ok onced msg is received' behaviour.
  // This way, we can process msg and let NATS know everthing is fine once we sucessfuly
  // made what we wanted with it. If after 30 secs NATS hasn't received any confirmation,
  // the msg will be sent to any other member of the queue group
  const options = stan.subscriptionOptions().setManualAckMode(true);
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
