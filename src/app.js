import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import Routes
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import ticketRouter from "./routes/ticket.routes.js";

// Import Error Middleware
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Basic Production Security & Parsers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Mount Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tickets", ticketRouter);

// Centralized Error Handling Middleware (Must be last)
app.use(errorHandler);

export { app };
