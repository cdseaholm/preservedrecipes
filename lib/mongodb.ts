import { getMongoDBUri } from "@/utils/helpers/helpers";
import _mongoose, { connect } from "mongoose";

declare global {
  var mongoose: {
    promise: ReturnType<typeof connect> | null;
    conn: typeof _mongoose | null;
  };
}

async function connectDB() {
  const MONGODB_URI = await getMongoDBUri();

  if (!MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local");
  }

  let cached = global.mongoose;

  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = connect(MONGODB_URI, {
      bufferCommands: false,
    }).catch((error) => {
      console.error("Connection to database failed");
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
