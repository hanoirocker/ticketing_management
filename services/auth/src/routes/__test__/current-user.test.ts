import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  // First, sign up a valid user by using global function signin at setup.ts
  const cookie = await global.signup();

  // Then, try to get the current user information by using the extracted cookie
  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.email).toEqual('test@test.com');
});

// Respond with null for email field if not authenticated
it('responds with null if not authenticated', async () => {
  // Try to get the current user information without including the cookie
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);

  expect(res.body.email).toEqual(undefined);
});
