import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from '@hanoiorg/ticketing_common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
