import request from 'supertest';
import { app } from '../../app';

it('fails when email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when incorrect password is supplied for an existing user email', async () => {
  // First, create a valid user
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // Then, try accessing the signin route with the correct email but incorrect password
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'sdasdsadsa',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  // First, create a valid user
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  // Then, try accessing the signin route with the correct email and password
  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  // Check if the response has a Set-Cookie header
  expect(res.get('Set-Cookie')).toBeDefined();
});
