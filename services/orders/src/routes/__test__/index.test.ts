import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert1',
    price: 10,
  });
  await ticket.save();
  return ticket;
};

it('Fetches orders for a particular user', async () => {
  // First create three tickets and save them to db

  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  // Sign up two users
  const user1 = global.signin();
  const user2 = global.signin();

  // Create one order as user #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  // Create two orders as user #2
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order3 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  // Make request to get orders only for user #2
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);

  // Make sure orders retrieve belong to user #2
  expect(res.body.orders.length).toEqual(2);
  expect(res.body.orders[0].id).toBe(order2.id);
  expect(res.body.orders[1].id).toBe(order3.id);
  expect(res.body.orders[0].ticket.id).toBe(order2.ticket.id);
  expect(res.body.orders[1].ticket.id).toBe(order3.ticket.id);
});
