import { Project } from "../models/project.model.js";
import { Bug } from "../models/bug.model.js";
// Middleware to ensure user is a Project Admin/Owner
export const isProjectAdmin = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user._id; // set by verifyJWT middleware

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check if current user is the creator/admin of the project
    const isAdmin = project.owner.toString() === userId.toString();

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only project admins can perform this action",
      });
    }

    // Pass project object down to the request if needed
    req.project = project;
    next();
  } catch (error) {
    next(error);
  }
};

export const canDeleteBug = async (req, res, next) => {
  try {
    const { bugId } = req.params;
    const userId = req.user._id;

    const bug = await Bug.findById(bugId).populate("project");

    if (!bug) {
      return res.status(404).json({ success: false, message: "Bug not found" });
    }

    const isCreator = bug.createdBy.toString() === userId.toString();
    const isProjectOwner = bug.project.owner.toString() === userId.toString();

    if (!isCreator && !isProjectOwner) {
      return res.status(403).json({
        success: false,
        message: "Permission denied: You cannot delete this bug",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
