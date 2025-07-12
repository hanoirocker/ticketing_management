import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@hanoiorg/ticketing_common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
