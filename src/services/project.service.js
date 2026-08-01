import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

const MEMBER_FIELDS = "username email fullname";

export const createProjectService = async ({ name, description, ownerId }) => {
  if (!name) throw new ApiError(400, "Project name is required");

  const project = await Project.create({
    name,
    description,
    owner: ownerId,
    members: [ownerId], // Owner is automatically a member
  });

  return project;
};

export const getUserProjectsService = async (userId) => {
  // Fetch projects where the user is either the owner or a team member
  return await Project.find({
    $or: [{ owner: userId }, { members: userId }],
  })
    .populate("owner", MEMBER_FIELDS)
    .populate("members", MEMBER_FIELDS)
    .select("-__v");
};

export const updateProjectService = async ({
  projectId,
  name,
  description,
}) => {
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;

  const project = await Project.findByIdAndUpdate(
    projectId,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate("owner", MEMBER_FIELDS)
    .populate("members", MEMBER_FIELDS);

  if (!project) throw new ApiError(404, "Project not found");

  return project;
};

export const deleteProjectService = async (projectId) => {
  const project = await Project.findByIdAndDelete(projectId);

  if (!project) throw new ApiError(404, "Project not found");

  return project;
};

export const removeMemberFromProjectService = async ({
  projectId,
  memberId,
  requestingUserId,
}) => {
  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, "Project not found");

  if (project.owner.toString() !== requestingUserId.toString()) {
    throw new ApiError(403, "Only the project owner can remove members");
  }

  if (project.owner.toString() === memberId.toString()) {
    throw new ApiError(400, "The project owner cannot be removed");
  }

  if (!project.members.map((m) => m.toString()).includes(memberId)) {
    throw new ApiError(400, "User is not a member of this project");
  }

  project.members = project.members.filter(
    (m) => m.toString() !== memberId.toString()
  );
  await project.save();

  return Project.findById(projectId)
    .populate("owner", MEMBER_FIELDS)
    .populate("members", MEMBER_FIELDS);
};

export const addMemberToProjectService = async ({
  projectId,
  identifier,
  requestingUserId,
}) => {
  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, "Project not found");

  // Only the project owner can add team members
  if (project.owner.toString() !== requestingUserId.toString()) {
    throw new ApiError(403, "Only the project owner can add new members");
  }

  if (!identifier || !identifier.trim()) {
    throw new ApiError(400, "Username or email is required");
  }

  const normalized = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [{ username: normalized }, { email: normalized }],
  });

  if (!user) {
    throw new ApiError(404, "No user found with that username or email");
  }

  if (project.members.map((m) => m.toString()).includes(user._id.toString())) {
    throw new ApiError(400, "User is already a member of this project");
  }

  project.members.push(user._id);
  await project.save();

  return Project.findById(projectId)
    .populate("owner", MEMBER_FIELDS)
    .populate("members", MEMBER_FIELDS);
};
