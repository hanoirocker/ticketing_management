import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

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
