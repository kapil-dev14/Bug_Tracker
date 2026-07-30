import { Router } from "express";
import {
  addComment,
  getBugComments,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router({ mergeParams: true });

router.use(verifyJWT);

// Nested routes: /api/v1/bugs/:bugId/comments
router.route("/").post(addComment).get(getBugComments);

// Direct delete route: /api/v1/comments/:commentId
router.route("/:commentId").delete(deleteComment);

export default router;
