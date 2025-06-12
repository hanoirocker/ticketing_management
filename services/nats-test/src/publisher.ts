import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const clientId = randomBytes(4).toString('hex');

// Create a client instance (stan), which connects to our NATS SS
// to exchange data with it.
const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

// After stan connects sucessfully it emits a 'connect' event by default,
// so let's listen for it to verify this.
stan.on('connect', () => {
  console.log(`Publisher with clientId ${clientId} connected to NATS SS`);
  console.log(`Process ${process.pid}`);

  // Once connected, build the data (message) to be sent.
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  // Finally, publish the event including channel name and data.
  // Third argument is an optional callback.
  stan.publish('ticket:created', data, () => {
    console.log('EVENT PUBLISHED');
  });
});
