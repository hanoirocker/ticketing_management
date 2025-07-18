import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
} from '@hanoiorg/ticketing_common';
import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot paid for a cancelled order!');
    }

    // Try to charge the user with provided data
    const stripeData = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    // Create a payment doc and save it
    const payment = Payment.build({
      orderId: orderId,
      stripeId: stripeData.id,
    });

    await payment.save();

    // Emit a payment created event
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    // If previous checks were passed, we can finally charge the user
    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
