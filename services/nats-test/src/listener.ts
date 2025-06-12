import nats, { Message, Stan } from 'node-nats-streaming';
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

// Abstract class to instace a listener for all different kind of events
// flowing throgh our app
abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void; // Where business logic lives

  private client: Stan;
  protected ackWait = 5 * 1000; // time to wait for an event, 5 secs

  constructor(client: Stan) {
    this.client = client;
  }

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
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  // Set up channel for listening to and queue name
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message recieved: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data) // parse string
      : JSON.parse(data.toString('utf8')); // parse a buffer
  }
}

class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payment-service';
  onMessage(data: any, msg: Message) {
    console.log('Event data:', data);

    // Marks the message as sucessfully being parsed
    msg.ack();
  }
}
