import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const clientId = randomBytes(4).toString('hex');

// Create a client instance (stan), which connects to our NATS SS
// to exchange data with it.
const stan = nats.connect('ticketing', clientId, {
  url: 'http://localhost:4222',
});

// After stan connects successfully it emits a 'connect' event by default,
// so let's listen for it to verify this.
stan.on('connect', async () => {
  console.log(`Publisher with clientId ${clientId} connected to NATS SS`);
  console.log(`Process ${process.pid}`);

  const publisher = new TicketCreatedPublisher(stan);
  // Once connected, publish data as a `TicketCreatedEvent` event.
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.log(err);
  }
});
