import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedEvent } from '@hanoiorg/ticketing_common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create a ticket and save it to collection
  const ticket = Ticket.build({
    title: 'concert',
    price: 50,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  // Create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'CHANGE',
    price: 55,
    userId: '3151313415',
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(), // mock the ack function to test if it's been called or not
  };

  return { listener, data, ticket, msg };
};

it('finds, updates and saves a ticket', async () => {
  // Create a ticket and setup listener
  const { listener, data, ticket, msg } = await setup();

  // Call the onMessage function with data + msg objs to update the ticket with
  // doomie data
  await listener.onMessage(data, msg);

  // Fetch the ticket to make assertion about ticket creation
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(ticket).toBeDefined();

  // Verify fetched data hast the updated title and price, also new version
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
