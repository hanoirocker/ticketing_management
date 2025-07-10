import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@hanoiorg/ticketing_common';
// import { Payment } from '../../models/payment';

jest.mock('../../stripe');

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

it('returns a 201 with valid inputs', async () => {
  // const userId = new mongoose.Types.ObjectId().toHexString();
  //// Create a random price for making the API request into Stripe API. We'll later on
  //// use this price for searching through the list of calls retrieved
  // const price = Math.floor(Math.random() * 100000);
  //// First, create an order and save it
  // const order = Order.build({
  //   id: new mongoose.Types.ObjectId().toHexString(),
  //   version: 0,
  //   userId: userId,
  //   price: price,
  //   status: OrderStatus.Created,
  // });
  // await order.save();
  // await request(app)
  //   .post('/api/payments')
  //   .set('Cookie', global.signin(userId))
  //   .send({
  //     token: 'tok_visa',
  //     orderId: order.id,
  //   })
  //   .expect(201);
  //// Get a list of the 50 most recent charges
  // const stripeCharges = await stripe.charges.list({ limit: 50 });
  //// Try to find a charge with the used price
  // const stripeCharge = stripeCharges.data.find((charge) => {
  //   return charge.amount === price * 100;
  // });
  // expect(stripeCharge).toBeDefined();
  //// Now try to look for the Payment document to see if it was correctly created
  // const payment = await Payment.findOne({
  //   orderId: order.id,
  //   stripeId: stripeCharge!.id,
  // });
  // expect(payment).not.toBeNull();
});
