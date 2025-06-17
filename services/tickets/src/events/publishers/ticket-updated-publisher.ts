import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from '@hanoiorg/ticketing_common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
