import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";

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
    .populate("owner", "username email fullname")
    .select("-__v");
};

export const addMemberToProjectService = async ({
  projectId,
  memberId,
  requestingUserId,
}) => {
  const project = await Project.findById(projectId);

  if (!project) throw new ApiError(404, "Project not found");

  // Only the project owner can add team members
  if (project.owner.toString() !== requestingUserId.toString()) {
    throw new ApiError(403, "Only the project owner can add new members");
  }

  if (project.members.includes(memberId)) {
    throw new ApiError(400, "User is already a member of this project");
  }

  project.members.push(memberId);
  await project.save();

  return project;
};
