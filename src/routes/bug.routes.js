import { Router } from "express";
import {
  createBug,
  getProjectBugs,
  getBugById,
  updateBug,
  deleteBug,
  getProjectSummary,
} from "../controllers/bug.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { canDeleteBug } from "../middleware/role.middleware.js";

// Import Middleware and Schema
import { validate } from "../middleware/validate.middleware.js";
import { createBugSchema } from "../validators/bug.validator.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router({ mergeParams: true });

// Apply JWT authentication to all bug routes
router.use(verifyJWT);

// Get Project Summary
router.get("/summary", getProjectSummary);

// Bug CRUD operations (Single route definition for "/")
// router
//   .route("/")
//   .post(
//     upload.array("attachments", 5), // Multer runs FIRST to parse form-data body
//     validate(createBugSchema), // Zod runs SECOND on populated req.body
//     createBug // Controller runs LAST
//   )
//   .get(getProjectBugs);
router
  .route("/")
  .post(
    upload.fields([{ name: "attachments", maxCount: 5 }]), // Multer runs FIRST to parse form-data body
    validate(createBugSchema), // Zod runs SECOND on populated req.body
    createBug // Controller runs LAST
  )
  .get(getProjectBugs);

// Individual bug routes
router
  .route("/:bugId")
  .get(getBugById)
  .patch(updateBug)
  .delete(canDeleteBug, deleteBug);

export default router;
