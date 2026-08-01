import mongoose from "mongoose"; // <-- Fix for mongoose.Types.ObjectId in summary service
import { Bug } from "../models/bug.model.js";
import { Project } from "../models/project.model.js";
import { resolveUserId } from "../utils/resolveUser.js";

export const createBugService = async ({
  title,
  description,
  priority,
  projectId,
  assignedTo,
  createdBy,
  attachments = [], // <-- 1. Accept attachments array (defaults to empty)
}) => {
  // 1. Verify that the project exists
  const project = await Project.findById(projectId);
  if (!project) {
    const error = new Error("Project not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Create the new bug entry (assignedTo may be a username/email typed
  // in the frontend, so resolve it to a real user _id first)
  const bug = await Bug.create({
    title,
    description,
    priority,
    project: projectId,
    assignedTo: await resolveUserId(assignedTo),
    createdBy,
    attachments, // <-- 2. Save attachment URLs into the document
  });

  return bug;
};

export const getProjectBugsService = async (projectId, queryParams) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = queryParams;

  // 1. Build dynamic Mongoose query filter
  const filter = { project: projectId };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  // Search keyword in title or description (case-insensitive)
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // 2. Calculate pagination metrics
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  // 3. Query Database
  const bugs = await Bug.find(filter)
    .populate("assignedTo", "username email")
    .populate("createdBy", "username email")
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limitNum);

  const totalBugs = await Bug.countDocuments(filter);
  const totalPages = Math.ceil(totalBugs / limitNum);

  return {
    bugs,
    pagination: {
      totalBugs,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

export const getBugByIdService = async (bugId) => {
  const bug = await Bug.findById(bugId)
    .populate("assignedTo", "username email fullname")
    .populate("createdBy", "username email fullname")
    .populate("project", "name");

  if (!bug) {
    const error = new Error("Bug not found");
    error.statusCode = 404;
    throw error;
  }

  return bug;
};

export const updateBugService = async (bugId, updateData) => {
  if (updateData.assignedTo !== undefined) {
    updateData.assignedTo = await resolveUserId(updateData.assignedTo);
  }

  const bug = await Bug.findByIdAndUpdate(
    bugId,
    { $set: updateData },
    { new: true, runValidators: true } // returns the updated doc & validates enums
  );

  if (!bug) {
    const error = new Error("Bug not found");
    error.statusCode = 404;
    throw error;
  }

  return bug;
};

export const deleteBugService = async (bugId) => {
  const bug = await Bug.findByIdAndDelete(bugId);

  if (!bug) {
    const error = new Error("Bug not found");
    error.statusCode = 404;
    throw error;
  }

  return bug;
};

export const getProjectSummaryService = async (projectId) => {
  const stats = await Bug.aggregate([
    {
      $match: { project: new mongoose.Types.ObjectId(projectId) },
    },
    {
      $group: {
        _id: null,
        totalBugs: { $sum: 1 },
        openBugs: {
          $sum: { $cond: [{ $eq: ["$status", "OPEN"] }, 1, 0] },
        },
        inProgressBugs: {
          $sum: { $cond: [{ $eq: ["$status", "IN_PROGRESS"] }, 1, 0] },
        },
        resolvedBugs: {
          $sum: { $cond: [{ $eq: ["$status", "RESOLVED"] }, 1, 0] },
        },
        criticalBugs: {
          $sum: { $cond: [{ $eq: ["$priority", "CRITICAL"] }, 1, 0] },
        },
      },
    },
  ]);

  return (
    stats[0] || {
      totalBugs: 0,
      openBugs: 0,
      inProgressBugs: 0,
      resolvedBugs: 0,
      criticalBugs: 0,
    }
  );
};
