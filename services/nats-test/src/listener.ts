import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './events/ticket-created-listener';
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

  const listenerInstace = new TicketCreatedListener(stan);
  // Put the instance to listen for events
  listenerInstace.listen();
});

// Watches for interrupt or termination signals. If any of those are intercepted,
// we tell NATS to not send any more messages into this client
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
