import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var signin: () => string[];
}

let mongo: any;

// Import nats mock for all test files
jest.mock('../nats-wrapper');

// Create a new MongoDB in-memory server instance
// and connect to it using mongoose
beforeAll(async () => {
  // Clear all data related to mocked objects
  jest.clearAllMocks();

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
 * Global function for moking the sign-in process
 * Only available at the test env of the app (__test__ folder)
 */
global.signin = () => {
  // Build a JWT payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object { jwt: MY_JWT}
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
