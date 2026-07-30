import { z } from "zod";

export const createBugSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(3, "Title must be at least 3 characters long"),
    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(10, "Description must be at least 10 characters long"),
    priority: z
      .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
      .optional()
      .default("MEDIUM"),
    status: z
      .enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
      .optional()
      .default("OPEN"),
  }),
});
