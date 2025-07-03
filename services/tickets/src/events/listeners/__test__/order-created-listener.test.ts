import { OrderCancelledListener } from '../order-cancelled-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@hanoiorg/ticketing_common';
import mongoose, { mongo } from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // Create aand save a  ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toDateString(),
    ticket: {
      id: ticket.id, // id of the ticket previously created
      price: ticket.price, // idem
    },
  };

  // Create message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('', async () => {});
it('', async () => {});
it('', async () => {});
