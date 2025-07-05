import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@hanoiorg/ticketing_common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
