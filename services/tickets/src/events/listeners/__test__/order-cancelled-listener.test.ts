import { OrderCancelledListener } from '../order-cancelled-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledEvent, OrderStatus } from '@hanoiorg/ticketing_common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create aand save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  // Create an orderId for introducing it later into the ticketCreated for
  // simulating an order for reserving it
  const orderId = new mongoose.Types.ObjectId().toHexString();

  ticket.set({ orderId });
  await ticket.save();

  // Create a fake data event
  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(), // orderId let's just say
    version: 0,
    ticket: {
      id: ticket.id, // id of the ticket previously created
    },
  };

  // Create message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it('updatedes the ticket, publishes the event, and acks the message', async () => {
  const { listener, ticket, data, msg } = await setup();

  // Send the message. After this, the ticket its supossed to NOT have orderId included
  await listener.onMessage(data, msg);

  // Fetch the previous ticket
  const updatedTicket = await Ticket.findById(ticket.id);

  // expect the orderId to be undefined, since the listener is supposed to take it off if present
  expect(updatedTicket!.orderId).not.toBeDefined();

  // expect an event to have been published (update event)
  expect(msg.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
