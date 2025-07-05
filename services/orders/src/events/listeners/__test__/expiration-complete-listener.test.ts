import { Message } from 'node-nats-streaming';
import { natsWrapper } from '../../../nats-wrapper';
import {
  ExpirationCompleteEvent,
  OrderStatus,
} from '@hanoiorg/ticketing_common';
import mongoose from 'mongoose';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const setup = async () => {
  // Create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create a fake ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });

  await ticket.save();

  // Create a fake order to mark the previous ticket as reserved
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  // Create a fake data for expiration complete event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it('updates the order status to cancelled', async () => {
  // Setup listener
  const { listener, order, data, msg } = await setup();

  // After this, we would have a fake ticket reserved and an 'order:cancelled' event triggered
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an order:cancelled event', async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  // Verify the mocked publish method has been invoked first
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // Why [1][1]?: first [1] refers to the second item of the list of calls (this is the)
  // second test so that's why.
  // Second [1] refers to the data itself, being [0] the order status, which is not parsable
  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[1][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
