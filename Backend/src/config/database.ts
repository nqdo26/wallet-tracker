import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/wallet-tracker";

    await mongoose.connect(mongoUri);

    mongoose.connection.on("error", (error) => {
      process.stderr.write(`MongoDB connection error: ${error.message}\n`);
    });

    mongoose.connection.on("disconnected", () => {
      process.stderr.write("MongoDB disconnected\n");
    });
  } catch (error) {
    if (error instanceof Error) {
      process.stderr.write(`Failed to connect to MongoDB: ${error.message}\n`);
    }
    throw error;
  }
};
