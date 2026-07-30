import mongoose, { Schema } from "mongoose";

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Ticket title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Ticket description is required"],
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Under Review", "Resolved"],
      default: "Open",
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient ticket search/filtering by project and status
ticketSchema.index({ project: 1, status: 1 });

export const Ticket = mongoose.model("Ticket", ticketSchema);
