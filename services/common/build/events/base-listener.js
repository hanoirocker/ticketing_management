"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
// Abstract class to instace a listener for all different kind of events
// flowing throgh our app
class Listener {
    constructor(client) {
        this.ackWait = 5 * 1000; // time to wait for an event, 5 secs
        this.client = client;
    }
    /**
     * To set options, we need to call each method as chain after `subscriptionOptions`
     *
     * - setMnualAckMode(true): stops the default 'everything is ok onced msg is received' behaviour.
     * Thisway, we can process msg and let NATS know everthing is fine once we successfully
     * madewhat we wanted with it. If after 30 secs NATS hasn't received any confirmation,
     * the msg will be sent to any other member of the queue group
     * - setDeliverAllAvailable(): makes it possible for retreving all events processed in the past
     * in case the service goes down. This is run only one time as the services goes up.
     * - setDurableName(): makes it possible to return only not processed sucesfully events,
     * so we don't retrieve ALL events after a service goes down.
     */
    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }
    // Set up channel for listening to and queue name
    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', (msg) => {
            console.log(`Message recieved: ${this.subject} / ${this.queueGroupName}`);
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }
    parseMessage(msg) {
        const data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data) // parse string
            : JSON.parse(data.toString('utf8')); // parse a buffer
    }
}
exports.Listener = Listener;
