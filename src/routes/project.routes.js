import { Router } from "express";
import {
  createProject,
  getUserProjects,
  addMemberToProject,
} from "../controllers/project.controller.js";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { isProjectAdmin } from "../middleware/role.middleware.js";
const router = Router();

// Protect all project routes
router.use(verifyJWT);

router.route("/").post(createProject).get(getUserProjects);

// Only Admins or Project Owners can add team members
router.post("/:projectId/members", authorizeRoles("Admin"), addMemberToProject);
// 2. Must be project admin to add members
router.post("/:projectId/members", isProjectAdmin, addMemberToProject);
export default router;
