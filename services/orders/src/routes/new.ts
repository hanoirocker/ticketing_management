import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@hanoiorg/ticketing_common';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = express.Router();

// If in the future the ticketId structure changes from within the tickets service
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
    // Find the ticket the user is trying to order in the database

    // Make sure this ticket is not already reserved

    // Calculate an expiration date for this order

    // Build the order and save it to the database

    // Publish order:created event
    res.send({});
  }
);

export { router as newOrderRouter };
