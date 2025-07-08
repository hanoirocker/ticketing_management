import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@hanoiorg/ticketing_common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    // version doesn't really matter here if we ever want to update the order, this would
    // be needed
    const savedOrder = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!savedOrder) {
      throw new Error(`Order not found with id: ${data.id}`);
    }

    // If found, put its status to cancelled
    savedOrder.set({ status: OrderStatus.Cancelled });

    await savedOrder.save();

    msg.ack();
  }
}
