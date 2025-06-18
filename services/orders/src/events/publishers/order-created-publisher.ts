import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from '@hanoiorg/ticketing_common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
