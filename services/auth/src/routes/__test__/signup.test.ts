import request from 'supertest';
import { app } from '../../app';

// Simulate creating a new user using a valid email and password and expect a 201 status code
it('Returns 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

// Simulate invalid signup when using invalid email
it('Returns 400 with invalid email ', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'jhesakjhejkaes',
      password: 'password',
    })
    .expect(400);
});

// Simulate invalid signup when using invalid password
it('Returns 400 with invalid  password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@email.com',
      password: '123',
    })
    .expect(400);
});

// Simulate invalid signup by missing params
it('Returns 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'password',
    })
    .expect(400);
});

// Simulate a user trying to signup with an already sign up email and password
it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

/***
 * We're using Cookie session middleware to convert the JWT into a string object
 * and return it into the response header. So we need to test if the cookie is set
 * in the header.
 * ***/
it('sets a cookie after successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
});
