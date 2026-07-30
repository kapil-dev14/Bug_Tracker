import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createCommentService,
  getBugCommentsService,
  deleteCommentService,
} from "../services/comment.service.js";

// @desc    Add a comment to a bug
// @route   POST /api/v1/bugs/:bugId/comments
export const addComment = asyncHandler(async (req, res) => {
  const { bugId } = req.params;
  const { content } = req.body;

  const comment = await createCommentService({
    bugId,
    authorId: req.user._id,
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// @desc    Get all comments for a bug
// @route   GET /api/v1/bugs/:bugId/comments
export const getBugComments = asyncHandler(async (req, res) => {
  const { bugId } = req.params;
  const comments = await getBugCommentsService(bugId);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

// @desc    Delete a comment
// @route   DELETE /api/v1/comments/:commentId
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  await deleteCommentService(commentId, req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});
