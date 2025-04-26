import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  // First, sign up a valid user
  const signUpResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // Extract the cookie from the response
  const cookie = signUpResponse.get('Set-Cookie');

  if (!cookie) {
    throw new Error('Cookie not set after signup');
  }

  // Then, try to get the current user information by using the extracted cookie
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.email).toEqual('test@test.com');
});
