import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

it('returns an error if the ticket does not axit', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {});
it('it successfully reserves a ticket', async () => {});
