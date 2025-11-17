import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      // Server started
    });
  } catch (error) {
    process.exit(1);
  }
};

startServer();
