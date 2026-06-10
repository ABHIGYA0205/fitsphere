const mongoose = require('mongoose');

const uri = "mongodb+srv://abhigyasachdeva1234_db_user:zqT8xkhLHE3IdFiw@fitsphere.zccoveg.mongodb.net/fitsphere?retryWrites=true&w=majority&appName=fitsphere";

async function test() {
  try {
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
