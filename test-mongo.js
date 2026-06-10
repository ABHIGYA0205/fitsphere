const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

async function test() {
  try {
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set.");
    }
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(uri);
    console.log("✅ SUCCESS! Connected to MongoDB perfectly.");
    process.exit(0);
  } catch (e) {
    console.error("❌ FAILED TO CONNECT! See error below:");
    console.error(e);
    process.exit(1);
  }
}

test();
