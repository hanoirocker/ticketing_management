import request from 'supertest';
import { app } from '../app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var signup: () => Promise<string[]>;
}

let mongo: any;

// Create a new MongoDB in-memory server instance
// and connect to it using mongoose
beforeAll(async () => {
  // Set the environment variable to test. Needed since we splitted original index.ts
  // into app.ts and index.ts, so env variable is not set in the test environment
  process.env.JWT_KEY = 'asdasdasds';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

// Delete all data in the database before each test
beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

// Close the MongoDB connection and stop the in-memory server after all tests
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

/***
 * Global function for reusing the sign-in process
 * Only available at the test env of the app (__test__ folder)
 */
global.signup = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  if (!cookie) {
    throw new Error('Failed to get cookie from response');
  }
  return cookie;
};
