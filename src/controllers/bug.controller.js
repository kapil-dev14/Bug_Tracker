import {
  createBugService,
  getProjectBugsService,
  getBugByIdService,
  updateBugService,
  deleteBugService,
  getProjectSummaryService,
} from "../services/bug.service.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// @desc    Create a new bug under a project (with optional file attachments)
// @route   POST /api/v1/projects/:projectId/bugs
export const createBug = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, assignedTo } = req.body;

    // upload.fields() puts files under req.files.<fieldName>, not req.files
    // directly - and attachments are optional, so default to an empty array
    const files = req.files?.attachments || [];

    const attachmentUrls = [];
    for (const file of files) {
      const url = await uploadOnCloudinary(file.path);
      if (url) attachmentUrls.push(url);
    }

    const bug = await createBugService({
      title,
      description,
      priority,
      projectId,
      assignedTo,
      createdBy: req.user._id,
      attachments: attachmentUrls,
    });

    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "Bug reported successfully",
      data: bug,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bugs for a specific project
// @route   GET /api/v1/projects/:projectId/bugs
export const getProjectBugs = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  // Pass req.query directly (contains page, limit, status, priority, search)
  const result = await getProjectBugsService(projectId, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Project bugs fetched successfully"));
});

// @desc    Get a single bug by id (with comments' bug detail, populated)
// @route   GET /api/v1/bugs/:bugId
export const getBugById = async (req, res, next) => {
  try {
    const { bugId } = req.params;
    const bug = await getBugByIdService(bugId);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Bug fetched successfully",
      data: bug,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bug status or details
// @route   PATCH /api/v1/bugs/:bugId
export const updateBug = async (req, res, next) => {
  try {
    const { bugId } = req.params;
    const updateData = req.body;

    const updatedBug = await updateBugService(bugId, updateData);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Bug updated successfully",
      data: updatedBug,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a bug
// @route   DELETE /api/v1/bugs/:bugId
export const deleteBug = async (req, res, next) => {
  try {
    const { bugId } = req.params;
    await deleteBugService(bugId);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Bug deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics for a project
// @route   GET /api/v1/projects/:projectId/summary
export const getProjectSummary = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const summary = await getProjectSummaryService(projectId);

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};
