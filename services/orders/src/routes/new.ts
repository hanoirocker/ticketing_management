import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@hanoiorg/ticketing_common';
import mongoose from 'mongoose';
import { body } from 'express-validator';

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
    res.send({});
  }
);

export { router as newOrderRouter };
