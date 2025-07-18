import { Subjects } from './subjects';

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string; // --> paymentId
    orderId: string;
    stripeId: string;
  };
}
