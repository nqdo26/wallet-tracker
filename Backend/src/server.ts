import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    const server = app.listen(PORT, () => {
      if (process.env.NODE_ENV === "development") {
        process.stdout.write(`Server running on http://localhost:${PORT}\n`);
        process.stdout.write(`Environment: ${process.env.NODE_ENV}\n`);
      }
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      process.stdout.write(
        `\n${signal} received. Closing server gracefully...\n`
      );

      server.close(() => {
        process.stdout.write("Server closed.\n");
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        process.stderr.write("Forced shutdown after timeout.\n");
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    if (error instanceof Error) {
      process.stderr.write(`Failed to start server: ${error.message}\n`);
    }
    process.exit(1);
  }
};

startServer();
