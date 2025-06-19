import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from '@hanoiorg/ticketing_common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // If ticket is found by id and previous version, update values and update version
    // to current as well.
    const { title, price, version } = data;
    ticket.set({ title, price, version });
    await ticket.save();

    msg.ack();
  }
}
