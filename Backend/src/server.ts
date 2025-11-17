import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      if (process.env.NODE_ENV === "development") {
        // Development mode logging allowed
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      // Log critical startup errors
      process.stderr.write(`Failed to start server: ${error.message}\n`);
    }
    process.exit(1);
  }
};

startServer();
