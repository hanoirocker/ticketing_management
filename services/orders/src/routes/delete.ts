import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@hanoiorg/ticketing_common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledEvent } from '@hanoiorg/ticketing_common';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // if everything is ok, then update its status and save it
    order.status = OrderStatus.Cancelled;
    order.save();

    // publish event saying the order has been cancelled (maybe other apps need to know this?)
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    // NOTE: We're not really deleting anything here, we're just updating properties values
    // Still, we'll kind of fake a deletion just because we can :p
    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
