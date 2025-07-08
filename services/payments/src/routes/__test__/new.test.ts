import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@hanoiorg/ticketing_common';

it('returns 404 when purchasing an order that does not exist', async () => {
  // Create a payment
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '13uio2u1i3ou12oi',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404); // since we haven't created an order with the given orderId previously
});

it('returns 401 for unauthorized users trying to purchase an order', async () => {
  // First, create an order
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 30,
    status: OrderStatus.Created,
  });

  await order.save();

  // Now, try to pay for that order but using a different userId
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: '13uio2u1i3ou12oi',
      orderId: order.id,
    })
    .expect(401);
});

it('returns 400 when purchasing cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  // First, create an order and save it
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: userId,
    price: 30,
    status: OrderStatus.Cancelled,
  });

  await order.save();

  // Now cancelled the order and save it
  order.set({ status: OrderStatus.Cancelled });
  await order.save();

  // Now, try to pay for that order using the correct userId (the one that created the order)
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: '13uio2u1i3ou12oi',
      orderId: order.id,
    })
    .expect(400);
});
