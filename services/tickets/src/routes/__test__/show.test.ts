import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  // Generate a random valid id using mongoose method
  const id = new mongoose.Types.ObjectId().toHexString();
  // Ticket shouldn't be found, so expect 404 (NotFoundError)
  // NOTE: "NotFoundError: Not found!" log will show on console after running the test,
  // but that's ok since ticket isn't supposed to be found.
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it('returns a ticket if found', async () => {
  // Make a real request for creating a ticket, for finding it later
  const title = 'Concert';
  const price = 20;

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: title,
      price: price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
