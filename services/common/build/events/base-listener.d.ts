import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
interface Event {
    subject: Subjects;
    data: any;
}
export declare abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;
    private client;
    protected ackWait: number;
    constructor(client: Stan);
    /**
     * To set options, we need to call each method as chain after `subscriptionOptions`
     *
     * - setMnualAckMode(true): stops the default 'everything is ok onced msg is received' behaviour.
     * Thisway, we can process msg and let NATS know everthing is fine once we sucessfuly
     * madewhat we wanted with it. If after 30 secs NATS hasn't received any confirmation,
     * the msg will be sent to any other member of the queue group
     * - setDeliverAllAvailable(): makes it possible for retreving all events processed in the past
     * in case the service goes down. This is run only one time as the services goes up.
     * - setDurableName(): makes it possible to return only not processed sucesfully events,
     * so we don't retrieve ALL events after a service goes down.
     */
    subscriptionOptions(): import("node-nats-streaming").SubscriptionOptions;
    listen(): void;
    parseMessage(msg: Message): any;
}
export {};
