import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toEqual(404);
});

it('can only be accessed if user is signed in', async () => {
  // If user sends an empty object (without JWT token) request should fail with
  // a 401 status defined at class NotAuthorizedError.
  // For this, we have the requireAuth ad currentUser middlewares
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({});

  expect(res.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  // validate-request middleware defines RequestValidationError for requests
  // missing params (status 400). Let's use it.

  // Case: user misses title param or is empty.
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: '10',
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: '10',
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  // Case: user misses price param or is invalid.
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
    })
    .expect(400);
});

it('creates a ticket with valid inputs', async () => {
  // Get all tickets inside of the collection. Should be 0 since
  // we delete them at test/setup.ts on `beforeEach`.
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 10,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
});

it('publishes an event', async () => {
  // First create a ticket
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 10,
    })
    .expect(201);

  // After sucessfuly creating a ticket, we should be able to publish the event as well
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
