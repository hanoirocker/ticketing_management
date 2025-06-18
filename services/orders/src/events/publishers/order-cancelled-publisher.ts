import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@hanoiorg/ticketing_common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
