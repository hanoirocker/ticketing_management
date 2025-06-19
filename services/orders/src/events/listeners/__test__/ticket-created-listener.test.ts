import { TicketCreatedListener } from '../ticket-created-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@hanoiorg/ticketing_common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);
  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'concert',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(), // mock the ack function to test if it's been called or not
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  // Setup listener
  const { listener, data, msg } = await setup();

  // Call the onMessage function with data + msg objs to create the ticket with
  // doomie data
  await listener.onMessage(data, msg);

  // Assertions on ticket creation
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it('acks the message', async () => {
  // Setup listener
  const { listener, data, msg } = await setup();

  // Call the onMessage function with data + msg objs
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack is called
  expect(msg.ack).toHaveBeenCalled();
});
