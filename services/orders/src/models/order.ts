import mongoose from 'mongoose';
import { OrderStatus } from '@hanoiorg/ticketing_common';

// Properties needed to create an order (TODO: define TicketDoc interface somewhere else)
interface OrderAttrs {
  userId: string;
  status: OrderStatus; // enum for all possibly values
  expiresAt: Date;
  // ticket: TicketDoc;
}

// Properties of a saved order (document)
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  // ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

/**
 * expiresAt: not required since this can be null when the ticket is already bought or deleted
 */
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
