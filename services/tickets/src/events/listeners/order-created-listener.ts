import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@hanoiorg/ticketing_common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // Error if not found
    if (!ticket) {
      throw new Error('Ticket not found for given orderId');
    }
    // If found ..
    // CRITICAL STEP --> Mark the ticket as RESERVED by setting its orderId property
    // oderId is not a primary attribute of a ticket, if its there it means it's reserved!
    ticket.set('orderId', data.id);
    // Save it and ack message
    await ticket.save();
    msg.ack();
  }
}
