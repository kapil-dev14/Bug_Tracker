import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createProjectService,
  getUserProjectsService,
  addMemberToProjectService,
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

export const addMemberToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { memberId } = req.body;

  const project = await addMemberToProjectService({
    projectId,
    memberId,
    requestingUserId: req.user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, project, "Member added to project successfully")
    );
});
