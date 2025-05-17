import request from 'supertest';
import { app } from '../../app';

// Helper function for creating a ticket
const createTicket = async () => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'test',
    price: 20,
  });
};

it('can fetch a list of tickets', async () => {
  // Create three tickets for then to fetch
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get('/api/tickets').send().expect(200);

  // We assume before creating the route that this route will return a list of tickets
  expect(res.body.length).toEqual(3);
});
