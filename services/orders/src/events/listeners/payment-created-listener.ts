import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@hanoiorg/ticketing_common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found for the given id');
    }

    // We don't care about updating the version thou it should be updated since once the
    // order is completed we don't expect any other process for the order to go through
    order.set({ status: OrderStatus.Complete });

    await order.save();

    msg.ack();
  }
}
