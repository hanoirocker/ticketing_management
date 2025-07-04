import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exists', async () => {
  // Since all data from db is deleted before starting tests,
  // we shouldn't find it when calling the route.

  // This pass will pass at first not because of the id not found,
  // but because of the route not created yet!
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the suer is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'test',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  // First create a ticket
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20,
    });

  // Then, pretend to be another user trying to access the previously created ticket
  // by using its id from last response.
  // By calling signin() for the second time, we're generating a new session token,
  // which means we are a different user.
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'blabla',
      price: 1000,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  // First create a ticket and store the session token to pretend later
  // to be the same user trying to update the created ticket.
  const cookie = global.signin();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20,
    });

  // Try to update with invalid title
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  // Try to update with invalid price
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test2',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided inputs (valid flow)', async () => {
  const cookie = global.signin();

  // Create ticket successfully
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20,
    });

  // Update title successfully
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test2',
      price: 20,
    })
    .expect(200);

  // Update price successfully
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test2',
      price: 30,
    })
    .expect(200);

  // Fetch updated ticket and check if body attributes were updated
  const ticketResponse = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('test2');
  expect(ticketResponse.body.price).toEqual(30);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  // Create ticket successfully
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20,
    });

  // Update title successfully
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test2',
      price: 20,
    })
    .expect(200);

  // After successfully updating a ticket, we should be able to publish the event as well
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();

  // Create ticket successfully
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test',
      price: 20,
    });

  const ticket = await Ticket.findById(res.body.id);

  // Assign an orderId to simulate the ticket being reserved
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  // Trying to update a reserved ticket should result in a 400 BadRequestError
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'test2',
      price: 20,
    })
    .expect(400);
});
