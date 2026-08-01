import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";

// Accepts a username or email and returns the matching user's _id.
// Used anywhere the frontend lets someone type a person's name instead of
// pasting a raw Mongo ObjectId (bug/ticket assignment, project members).
export const resolveUserId = async (identifier) => {
  if (!identifier || !identifier.trim()) return undefined;

  const normalized = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ username: normalized }, { email: normalized }],
  }).select("_id");

  if (!user) {
    throw new ApiError(
      404,
      `No user found with username or email "${identifier}"`
    );
  }

  return user._id;
};

// Same, but for an array of identifiers (e.g. ticket.assignedTo)
export const resolveUserIds = async (identifiers = []) => {
  const list = Array.isArray(identifiers) ? identifiers : [identifiers];
  const ids = await Promise.all(list.filter(Boolean).map(resolveUserId));
  return ids.filter(Boolean);
};
