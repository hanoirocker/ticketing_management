import mongoose from 'mongoose';
import { TicketDoc } from './ticket';
import { OrderStatus } from '@hanoiorg/ticketing_common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };

// Properties needed to create an order
interface OrderAttrs {
  userId: string;
  status: OrderStatus; // enum for all possibly values
  expiresAt: Date;
  ticket: TicketDoc; // Ticket model to relate order to
}

// Properties of a saved order (document)
interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
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
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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
        // @ts-ignore
        ret.id = ret._id;
        // @ts-ignore
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
