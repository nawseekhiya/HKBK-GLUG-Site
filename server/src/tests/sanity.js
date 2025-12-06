import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

async function run() {
  try {
    console.log("Starting MongoMemoryServer...");
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    console.log("MongoMemoryServer started at:", uri);

    console.log("Connecting Mongoose...");
    await mongoose.connect(uri);
    console.log("Mongoose connected.");

    console.log("Disconnecting...");
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log("Done.");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

run();
