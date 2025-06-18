import { Subjects } from './subjects';
import { OrderStatus } from './types/order-status';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    expiresAt: string; // string out of a Date object
    ticket: {
      id: string;
      price: number;
    };
  };
}
