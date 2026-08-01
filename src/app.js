import express from "express";
import cors from "cors";
import helmet from "helmet"; // <-- 1. Import helmet
import cookieParser from "cookie-parser";

// Import Routes
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import ticketRouter from "./routes/ticket.routes.js";
import bugRouter from "./routes/bug.routes.js";
import commentRouter from "./routes/comment.routes.js";
// Import Error Middleware
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// 2. Add Helmet for Security Headers (Place it first in the middleware chain)
app.use(helmet());

// Basic Production Security & Parsers
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Mount Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tickets", ticketRouter);
app.use("/api/v1/projects/:projectId/bugs", bugRouter);
app.use("/api/v1/bugs/:bugId/comments", commentRouter);
app.use("/api/v1/bugs", bugRouter);
// Mount direct comment management routes
app.use("/api/v1/comments", commentRouter);
// Centralized Error Handling Middleware (Must be last)

app.use(errorHandler);

export { app };
