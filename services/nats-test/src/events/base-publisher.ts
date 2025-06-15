import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  // Publish the event including channel name and data.
  // Third argument is an optional callback.
  async publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        // if any error is returned in thse promise, return earlier and reject the promise
        if (err) reject(err);

        // if no errors received, resolve the promise with void return
        console.log('Event published to subject: ', this.subject);
        resolve();
      });
    });
  }
}
