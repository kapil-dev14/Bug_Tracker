import { Router } from "express";
import {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
  addMemberToProject,
  removeMemberFromProject,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isProjectAdmin } from "../middleware/role.middleware.js";
const router = Router();

// Protect all project routes
router.use(verifyJWT);

router.route("/").post(createProject).get(getUserProjects);

// Only the project owner can rename/describe or delete their project
router
  .route("/:projectId")
  .patch(isProjectAdmin, updateProject)
  .delete(isProjectAdmin, deleteProject);

// Only the project owner can add/remove team members
router.post("/:projectId/members", isProjectAdmin, addMemberToProject);
router.delete(
  "/:projectId/members/:memberId",
  isProjectAdmin,
  removeMemberFromProject
);

export default router;
