import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createProjectService,
  getUserProjectsService,
  updateProjectService,
  deleteProjectService,
  addMemberToProjectService,
  removeMemberFromProjectService,
} from "../services/project.service.js";

export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await createProjectService({
    name,
    description,
    ownerId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

export const getUserProjects = asyncHandler(async (req, res) => {
  const projects = await getUserProjectsService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects retrieved successfully"));
});

export const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  const project = await updateProjectService({ projectId, name, description });

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  await deleteProjectService(projectId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Project deleted successfully"));
});

export const addMemberToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { identifier } = req.body;

  const project = await addMemberToProjectService({
    projectId,
    identifier,
    requestingUserId: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, project, "Member added to project successfully")
    );
});

export const removeMemberFromProject = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;

  const project = await removeMemberFromProjectService({
    projectId,
    memberId,
    requestingUserId: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, project, "Member removed from project successfully")
    );
});
