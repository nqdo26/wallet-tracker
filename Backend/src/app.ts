import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./config/passport";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport middleware
app.use(passport.initialize());

// Routes
app.use("/api", routes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
