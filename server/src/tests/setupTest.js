import { MongoMemoryReplSet } from "mongodb-memory-server";
import mongoose from "mongoose";
import { beforeAll, afterAll, afterEach } from "@jest/globals";

let replSet;

beforeAll(async () => {
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" }
  });
  const uri = replSet.getUri();
  
  // Connect mongoose to the in-memory DB
  // We need to ensure we don't have an existing connection
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(uri);
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (replSet) {
    await replSet.stop();
  }
});
