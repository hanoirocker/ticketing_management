import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from '@hanoiorg/ticketing_common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Get the time difference in milisecs about the expire time and the actual time
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log('Waiting this many miliseconds to process the job: ', delay);

    // When the event is received, create a job and enqueue it
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
