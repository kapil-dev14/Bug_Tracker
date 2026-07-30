import { Comment } from "../models/comment.model.js";
import { Bug } from "../models/bug.model.js";

export const createCommentService = async ({ bugId, authorId, content }) => {
  // Check if bug exists
  const bug = await Bug.findById(bugId);
  if (!bug) {
    const error = new Error("Bug not found");
    error.statusCode = 404;
    throw error;
  }

  const comment = await Comment.create({
    content,
    bug: bugId,
    author: authorId,
  });

  return await comment.populate("author", "username email");
};

export const getBugCommentsService = async (bugId) => {
  return await Comment.find({ bug: bugId })
    .populate("author", "username email")
    .sort({ createdAt: -1 }); // Newest comments first
};

export const deleteCommentService = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
  }

  // Ensure only the author can delete their comment
  if (comment.author.toString() !== userId.toString()) {
    const error = new Error("Unauthorized to delete this comment");
    error.statusCode = 403;
    throw error;
  }

  await comment.deleteOne();
  return comment;
};
