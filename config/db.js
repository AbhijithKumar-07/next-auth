import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MOGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Wait 10s before failing
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
