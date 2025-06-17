import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@hanoiorg/ticketing_common';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

// If in the future the ticket id structure changes from within the tickets service
// we would have to modify/delete .custom validation. Right now is 100% based on mongoose's structure
router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure this ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket is
    // the ticket we just found AND the orders status IS NOT cancelled.
    // if we find an order from that, it means the ticket IS reserved.
    const alreadyExistingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });

    if (alreadyExistingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for this order

    // Build the order and save it to the database

    // Publish order:created event
    res.send({});
  }
);

export { router as newOrderRouter };
