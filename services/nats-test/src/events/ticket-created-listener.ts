import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';

export class TicketCreatedListener extends Listener {
  subject = 'ticket:created';
  queueGroupName = 'payment-service';
  onMessage(data: any, msg: Message) {
    console.log('Event data:', data);

    // Marks the message as sucessfully being parsed
    msg.ack();
  }
}
