// By creating interfaces and relating them with our enums, we can easily
// define each event structure and therefore making listeners a lot easier to use / understand

import { Subjects } from './subjects';

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
