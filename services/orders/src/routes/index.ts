import { requireAuth } from '@hanoiorg/ticketing_common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser?.id,
  }).populate('ticket'); // mongoose 'populate' method adds related ticket into each order retrieved

  res.send({ orders });
});

export { router as indexOrderRouter };
