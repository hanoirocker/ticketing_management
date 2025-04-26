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
