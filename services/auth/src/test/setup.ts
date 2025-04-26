import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;

beforeAll(async () => {
  // Create a new MongoDB in-memory server instance
  // and connect to it using mongoose
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  // Delete all data in the database before each test
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  // Close the MongoDB connection and stop the in-memory server after all tests
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});
