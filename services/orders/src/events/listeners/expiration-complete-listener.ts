import {
  ExpirationCompleteEvent,
  Listener,
  Subjects,
} from '@hanoiorg/ticketing_common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderStatus } from '@hanoiorg/ticketing_common';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    // If the order is found, cancel the order since the expiration time has finished
    // TODO: once Payment service is ready, revisit this part to ensure
    // NOT to cancel an order if the order has already been paid.
    order.set({
      status: OrderStatus.Cancelled,
    });

    await order.save();

    // Publish order:cancelled event to inform other services
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
