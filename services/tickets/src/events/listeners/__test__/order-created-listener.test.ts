import { OrderCreatedListener } from '../order-created-listener';
import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedEvent, OrderStatus } from '@hanoiorg/ticketing_common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create aand save a  ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 50,
    userId: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // Create a fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(), // orderId let's just say
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

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();

  // Send the message. After this, the ticket its supossed to have orderId included
  await listener.onMessage(data, msg);

  // Fetch the previous ticket
  const updatedTicket = await Ticket.findById(ticket.id);

  // check if ticket actually has the oderId attribute added and verify its value
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  // Setup listener
  const { listener, data, msg } = await setup();

  // Call the onMessage function with data + msg objs
  await listener.onMessage(data, msg);

  // Write assertions to make sure ack is called
  expect(msg.ack).toHaveBeenCalled();
});

it('it publishes a ticket updated event', async () => {
  // Setup listener
  const { listener, data, msg } = await setup();

  // Call the onMessage function with data + msg objs
  await listener.onMessage(data, msg);

  // expect the mocked publish fu nction to have been called from the mocked client
  // 3 times since each onMessage used on this files triggers the method 1 time
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(3);

  // @ts-ignore
  // console.log(natsWrapper.client.publish.mock.calls); // uncomment if we want to verify the previous calls
  // We can parse data from this last onMessage invoke to get data used, this way
  // we can compare it for last checks
  const updatedTicketData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[2][1]
  );

  // Compare the ticket updated OrderId vs the orderId from the order using data object from setup()
  expect(data.id).toEqual(updatedTicketData.orderId);
});
