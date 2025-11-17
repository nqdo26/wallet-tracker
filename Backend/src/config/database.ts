import mongoose from "mongoose";

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/wallet-tracker";

    await mongoose.connect(mongoUri);
  } catch (error) {
    throw error;
  }
};
