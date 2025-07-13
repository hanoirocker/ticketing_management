import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  orderId?: string; // '?' Since it's optional (string | undefined). This property if exists
  // means that the ticket is 'reserved' (order created during its purchasing proccess)
  version: number; // Since we're not using __v but version instead, we need to add this property
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      // not required since when ticket is first build, we don't need a orderId
      // associated with it. This is only for intercepting order event to relate them
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
ticketSchema.set('versionKey', 'version'); // rename __v default version naming to 'version'
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
