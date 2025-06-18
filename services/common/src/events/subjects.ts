// Subjects in world of NATS is name of a channel. We define them as enums
// for all event types to declare

export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',

  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',
}
