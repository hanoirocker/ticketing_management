import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

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

it('returns a 401 if the user does not own the ticket', async () => {});

it('returns a 400 if the user provides an invalid title or price', async () => {});

it('updates the ticket provided inputs (valid flow)', async () => {});
