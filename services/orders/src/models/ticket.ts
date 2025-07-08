import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// NOTE: We shouldn't use this plugin here since we should 100% rely on managing our ticket's
// version values based on recieved event data incoming from ticket:created and ticket:updated!
// import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Attrs to create a ticket object
interface TicketAttrs {
  title: string;
  price: number;
  id: string;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>; // Add function for checking if the ticket is already reserved or not
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(data: {
    // Customized method for finding a ticket by id and version number
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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

ticketSchema.set('versionKey', 'version'); // Just like we did at tickets service

// 'pre' is a middleware that runs BEFORE specific calls, like 'save' on this case
// This way we replace mongoose 'update-if-current' search optimizations by doing them
// here.
ticketSchema.pre('save', function (done) {
  // @ts-ignore
  this.$where = {
    version: this.get('version') - 1,
  };

  done();
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id, // for _id saved property to have the id value given when building the ticket (value from TicketAttrs)
    title: attrs.title,
    price: attrs.price,
  });
};

ticketSchema.statics.findByEvent = (data: {
  // Customized method for finding a ticket by id and version number
  id: string;
  version: number;
}) => {
  return Ticket.findOne({ _id: data.id, version: data.version - 1 });
};

// isReserved method declaration
ticketSchema.methods.isReserved = async function () {
  // Make sure this ticket is not already reserved
  // Run query to look at all orders. Find an order where the ticket is
  // the ticket we just found AND the orders status IS NOT cancelled.
  // if we find an order from that, it means the ticket IS reserved.
  const alreadyExistingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  // Resolves with a boolean (!! make sure it returns boolean in case is null/undefined, or it exists)
  return !!alreadyExistingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
